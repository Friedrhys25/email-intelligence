import { describe, expect, it, vi } from "vitest";
import type { EmailDTO } from "../../src/modules/gmail/email.dto.js";
import type { ProcessedEmail } from "../../src/modules/email-processor/priority.types.js";
import type { BuiltPrompt } from "../../src/modules/prompt-builder/prompt.types.js";
import type { SummaryResponse } from "../../src/modules/gemini/summary.schema.js";
import type {
  DeliveryResult,
  DispatchRequest
} from "../../src/modules/dispatcher/dispatcher.types.js";
import { InboxOrchestratorService } from "../../src/modules/orchestrator/inbox-orchestrator.service.js";

const email: EmailDTO = {
  id: "message-1",
  threadId: "thread-1",
  sender: "GitHub <noreply@github.com>",
  subject: "Security alert",
  date: "2026-07-04T07:00:00.000Z",
  snippet: "Security alert",
  body: "Please review this dependency.",
  labels: ["INBOX"]
};

const processedEmail: ProcessedEmail = {
  email,
  priority: "high",
  category: "action",
  actionRequired: true,
  importantContact: true,
  reasonIncluded: "important contact, action required",
  score: 6
};

const builtPrompt: BuiltPrompt = {
  systemPrompt: "system",
  userPrompt: "user",
  responseSchema: "schema",
  emailCount: 1
};

const summaryResponse: SummaryResponse = {
  summaries: [
    {
      emailId: "message-1",
      priority: "high",
      sender: "GitHub <noreply@github.com>",
      subject: "Security alert",
      summary: "A dependency needs review.",
      reason: "Dependency review is required.",
      actionRequired: true,
      deadline: null,
      confidence: 0.9
    }
  ]
};

describe("InboxOrchestratorService", () => {
  it("coordinates the full digest workflow", async () => {
    const fetchLatestEmails = vi.fn(() => Promise.resolve([email]));
    const process = vi.fn(() => [processedEmail]);
    const build = vi.fn(() => builtPrompt);
    const summarize = vi.fn(() => Promise.resolve(summaryResponse));
    const format = vi.fn(() => "# Inbox Intelligence");
    const deliveryResult: DeliveryResult = {
      status: "sent",
      provider: "discord",
      deliveredAt: "2026-07-04T07:00:00.000Z",
      correlationId: "run-1",
      statusCode: 204
    };
    const dispatch = vi.fn((request: DispatchRequest) =>
      Promise.resolve({ ...deliveryResult, correlationId: request.correlationId })
    );

    const service = new InboxOrchestratorService(
      { fetchLatestEmails },
      { process },
      { build },
      { summarize },
      { format },
      { dispatch }
    );

    const result = await service.runDigest();

    expect(result).toMatchObject({
      status: "completed",
      fetched: 1,
      included: 1,
      summarized: 1,
      dispatched: true,
      errors: []
    });
    expect(process).toHaveBeenCalledWith([email]);
    expect(build).toHaveBeenCalledWith([processedEmail]);
    expect(summarize).toHaveBeenCalledWith(builtPrompt);
    expect(format).toHaveBeenCalledWith(summaryResponse);
    expect(dispatch).toHaveBeenCalledOnce();
    const dispatchRequest = dispatch.mock.calls[0]?.[0];
    if (!dispatchRequest) {
      throw new Error("Expected digest dispatch to be called");
    }
    expect(dispatchRequest.markdown).toBe("# Inbox Intelligence");
    expect(typeof dispatchRequest.correlationId).toBe("string");
  });

  it("handles runs with no important emails", async () => {
    const emptyPrompt: BuiltPrompt = {
      ...builtPrompt,
      emailCount: 0
    };
    const emptySummaryResponse: SummaryResponse = {
      summaries: []
    };
    const service = new InboxOrchestratorService(
      { fetchLatestEmails: vi.fn(() => Promise.resolve([email])) },
      { process: vi.fn(() => []) },
      { build: vi.fn(() => emptyPrompt) },
      { summarize: vi.fn(() => Promise.resolve(emptySummaryResponse)) },
      { format: vi.fn(() => "# Inbox Intelligence\n\nNo important emails found.") },
      {
        dispatch: vi.fn(() =>
          Promise.resolve({
            status: "sent",
            provider: "discord",
            deliveredAt: "2026-07-04T07:00:00.000Z",
            correlationId: "run-1",
            statusCode: 204
          } as const)
        )
      }
    );

    await expect(service.runDigest()).resolves.toMatchObject({
      status: "completed",
      fetched: 1,
      included: 0,
      summarized: 0,
      dispatched: true
    });
  });

  it("returns failed run metadata when a module fails", async () => {
    const service = new InboxOrchestratorService(
      { fetchLatestEmails: vi.fn(() => Promise.reject(new Error("Gmail failed"))) },
      { process: vi.fn() },
      { build: vi.fn() },
      { summarize: vi.fn() },
      { format: vi.fn() },
      { dispatch: vi.fn() }
    );

    await expect(service.runDigest()).resolves.toMatchObject({
      status: "failed",
      dispatched: false,
      errors: ["Gmail failed"]
    });
  });
});
