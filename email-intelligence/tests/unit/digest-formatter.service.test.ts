import { describe, expect, it } from "vitest";
import {
  DigestFormatterService,
  sanitizeMarkdown
} from "../../src/modules/formatter/digest-formatter.service.js";
import type { EmailSummary, SummaryResponse } from "../../src/modules/gemini/summary.schema.js";

const createSummary = (overrides: Partial<EmailSummary> = {}): EmailSummary => ({
  emailId: "message-1",
  priority: "high",
  sender: "GitHub <noreply@github.com>",
  subject: "Security alert",
  summary: "A dependency vulnerability needs attention.",
  reason: "Dependency vulnerability detected.",
  actionRequired: true,
  deadline: "tomorrow",
  confidence: 0.91,
  ...overrides
});

describe("DigestFormatterService", () => {
  it("formats summaries grouped by priority", () => {
    const service = new DigestFormatterService();
    const digest = service.format({
      summaries: [
        createSummary({ priority: "low", subject: "FYI", actionRequired: false, deadline: null }),
        createSummary({ priority: "high", subject: "Security alert" }),
        createSummary({ priority: "medium", subject: "Review request" })
      ]
    });

    expect(digest).toContain("# Inbox Intelligence");
    expect(digest.indexOf("## High Priority")).toBeLessThan(digest.indexOf("## Medium Priority"));
    expect(digest.indexOf("## Medium Priority")).toBeLessThan(digest.indexOf("## Low Priority"));
    expect(digest).toContain("### Security alert");
    expect(digest).toContain("Email sender: GitHub <noreply@github.com>");
    expect(digest).toContain("Title: Security alert");
    expect(digest).toContain("Reason: Dependency vulnerability detected.");
    expect(digest).toContain("Action Required: Yes");
    expect(digest).toContain("Deadline: tomorrow");
  });

  it("formats a useful empty digest", () => {
    const service = new DigestFormatterService();

    expect(service.format({ summaries: [] })).toBe(
      "# Inbox Intelligence\n\nNo important emails found for this digest."
    );
  });

  it("handles missing optional deadline fields", () => {
    const service = new DigestFormatterService();
    const digest = service.format({
      summaries: [createSummary({ deadline: null, actionRequired: false })]
    });

    expect(digest).toContain("Action Required: No");
    expect(digest).toContain("Deadline: Not specified");
  });

  it("falls back to the summary when reason is missing", () => {
    const service = new DigestFormatterService();
    const digest = service.format({
      summaries: [createSummary({ reason: null })]
    });

    expect(digest).toContain("Reason: A dependency vulnerability needs attention.");
  });

  it("trims output to the configured Discord message limit", () => {
    const service = new DigestFormatterService({ maxDiscordMessageLength: 140 });
    const response: SummaryResponse = {
      summaries: [
        createSummary({
          summary:
            "This is a deliberately long summary that should exceed the small test message limit and trigger trimming."
        })
      ]
    };
    const digest = service.format(response);

    expect(digest.length).toBeLessThanOrEqual(140);
    expect(digest).toContain("Trimmed to fit Discord message limits.");
  });
});

describe("sanitizeMarkdown", () => {
  it("removes markdown control characters", () => {
    expect(sanitizeMarkdown("**Important** `token` | ~value~")).toBe("Important token value");
  });
});
