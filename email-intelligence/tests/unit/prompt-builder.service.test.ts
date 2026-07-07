import { describe, expect, it } from "vitest";
import {
  PromptBuilderService,
  sanitizePromptText
} from "../../src/modules/prompt-builder/prompt-builder.service.js";
import type { ProcessedEmail } from "../../src/modules/email-processor/priority.types.js";

const createProcessedEmail = (overrides: Partial<ProcessedEmail> = {}): ProcessedEmail => ({
  email: {
    id: "message-1",
    threadId: "thread-1",
    sender: "GitHub <noreply@github.com>",
    subject: "Security alert",
    date: "2026-07-04T07:00:00.000Z",
    snippet: "A dependency vulnerability was detected.",
    body: "Please review and fix the dependency by tomorrow.",
    labels: ["INBOX"]
  },
  priority: "high",
  category: "deadline",
  actionRequired: true,
  deadline: "tomorrow",
  importantContact: true,
  reasonIncluded: "important contact, action required, deadline detected: tomorrow",
  score: 8,
  ...overrides
});

describe("PromptBuilderService", () => {
  it("keeps system and user prompts separate", () => {
    const service = new PromptBuilderService();
    const prompt = service.build([createProcessedEmail()]);

    expect(prompt.systemPrompt).toContain("Inbox Intelligence");
    expect(prompt.userPrompt).toContain("Create an Inbox Intelligence digest");
    expect(prompt.systemPrompt).not.toBe(prompt.userPrompt);
  });

  it("includes required email metadata and schema instructions", () => {
    const service = new PromptBuilderService();
    const prompt = service.build([createProcessedEmail()]);

    expect(prompt.userPrompt).toContain('"sender": "GitHub <noreply@github.com>"');
    expect(prompt.userPrompt).toContain('"subject": "Security alert"');
    expect(prompt.userPrompt).toContain('"priority": "high"');
    expect(prompt.userPrompt).toContain('"reasonIncluded"');
    expect(prompt.userPrompt).toContain('"actionRequired": true');
    expect(prompt.userPrompt).toContain('"deadline": "tomorrow"');
    expect(prompt.responseSchema).toContain('"summaries"');
    expect(prompt.responseSchema).toContain('"confidence"');
  });

  it("handles empty input with an empty summaries instruction", () => {
    const service = new PromptBuilderService();
    const prompt = service.build([]);

    expect(prompt.emailCount).toBe(0);
    expect(prompt.userPrompt).toContain("No important emails were found");
    expect(prompt.userPrompt).toContain("empty summaries array");
  });

  it("truncates long body content deterministically", () => {
    const service = new PromptBuilderService({ maxBodyExcerptLength: 12 });
    const prompt = service.build([
      createProcessedEmail({
        email: {
          ...createProcessedEmail().email,
          body: "abcdefghijklmnopqrstuvwxyz"
        }
      })
    ]);

    expect(prompt.userPrompt).toContain('"bodyExcerpt": "abcdefghijkl..."');
  });

  it("redacts known secret patterns before building prompts", () => {
    const service = new PromptBuilderService();
    const prompt = service.build([
      createProcessedEmail({
        email: {
          ...createProcessedEmail().email,
          body: "GOOGLE_REFRESH_TOKEN=secret-token DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/secret"
        }
      })
    ]);

    expect(prompt.userPrompt).toContain("[REDACTED]");
    expect(prompt.userPrompt).not.toContain("secret-token");
    expect(prompt.userPrompt).not.toContain("discord.com/api/webhooks/secret");
  });
});

describe("sanitizePromptText", () => {
  it("redacts common credential values", () => {
    expect(sanitizePromptText("GEMINI_API_KEY=abc123")).toBe("[REDACTED]");
  });
});
