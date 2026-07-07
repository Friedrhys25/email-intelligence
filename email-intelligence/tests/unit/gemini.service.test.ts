import { describe, expect, it, vi } from "vitest";
import { AppError } from "../../src/shared/errors.js";
import type { BuiltPrompt } from "../../src/modules/prompt-builder/prompt.types.js";
import { GeminiService } from "../../src/modules/gemini/gemini.service.js";
import type { GeminiClient } from "../../src/modules/gemini/gemini.client.js";

const createPrompt = (overrides: Partial<BuiltPrompt> = {}): BuiltPrompt => ({
  systemPrompt: "system",
  userPrompt: "user",
  responseSchema: "schema",
  emailCount: 1,
  ...overrides
});

const validGeminiResponse = JSON.stringify({
  summaries: [
    {
      emailId: "message-1",
      priority: "high",
      sender: "GitHub <noreply@github.com>",
      subject: "Security alert",
      summary: "A dependency needs review.",
      actionRequired: true,
      deadline: "tomorrow",
      confidence: 0.91
    }
  ]
});

describe("GeminiService", () => {
  it("returns an empty summary response when there are no emails", async () => {
    const generateContent = vi.fn(() => Promise.resolve(validGeminiResponse));
    const geminiClient: GeminiClient = {
      generateContent
    };
    const service = new GeminiService(undefined, geminiClient);

    await expect(service.summarize(createPrompt({ emailCount: 0 }))).resolves.toEqual({
      summaries: []
    });
    expect(generateContent).not.toHaveBeenCalled();
  });

  it("parses and validates a valid Gemini JSON response", async () => {
    const geminiClient: GeminiClient = {
      generateContent: vi.fn(() => Promise.resolve(validGeminiResponse))
    };
    const service = new GeminiService(undefined, geminiClient);

    await expect(service.summarize(createPrompt())).resolves.toEqual({
      summaries: [
        {
          emailId: "message-1",
          priority: "high",
          sender: "GitHub <noreply@github.com>",
          subject: "Security alert",
          summary: "A dependency needs review.",
          actionRequired: true,
          deadline: "tomorrow",
          confidence: 0.91
        }
      ]
    });
  });

  it("accepts JSON wrapped in a markdown code fence", async () => {
    const geminiClient: GeminiClient = {
      generateContent: vi.fn(() => Promise.resolve(`\`\`\`json\n${validGeminiResponse}\n\`\`\``))
    };
    const service = new GeminiService(undefined, geminiClient);

    await expect(service.summarize(createPrompt())).resolves.toMatchObject({
      summaries: [{ emailId: "message-1" }]
    });
  });

  it("rejects invalid Gemini responses", async () => {
    const geminiClient: GeminiClient = {
      generateContent: vi.fn(() =>
        Promise.resolve(JSON.stringify({ summaries: [{ emailId: "" }] }))
      )
    };
    const service = new GeminiService(undefined, geminiClient);

    await expect(service.summarize(createPrompt())).rejects.toMatchObject({
      message: "Gemini returned an invalid summary response",
      statusCode: 502
    } satisfies Partial<AppError>);
  });

  it("retries transient Gemini failures", async () => {
    const generateContent = vi
      .fn<GeminiClient["generateContent"]>()
      .mockRejectedValueOnce(new AppError("rate limited", 429))
      .mockResolvedValueOnce(validGeminiResponse);
    const service = new GeminiService(
      {
        apiKey: "test-key",
        model: "test-model",
        retryAttempts: 2,
        retryDelayMs: 0
      },
      {
        generateContent
      }
    );

    await expect(service.summarize(createPrompt())).resolves.toMatchObject({
      summaries: [{ emailId: "message-1" }]
    });
    expect(generateContent).toHaveBeenCalledTimes(2);
  });

  it("does not retry permanent Gemini failures", async () => {
    const generateContent = vi
      .fn<GeminiClient["generateContent"]>()
      .mockRejectedValue(new AppError("bad request", 400));
    const service = new GeminiService(
      {
        apiKey: "test-key",
        model: "test-model",
        retryAttempts: 3,
        retryDelayMs: 0
      },
      {
        generateContent
      }
    );

    await expect(service.summarize(createPrompt())).rejects.toMatchObject({
      message: "bad request",
      statusCode: 400
    } satisfies Partial<AppError>);
    expect(generateContent).toHaveBeenCalledTimes(1);
  });
});
