import { env } from "../../config/env.js";
import { z } from "zod";
import { AppError } from "../../shared/errors.js";
import { logger } from "../../shared/logger.js";
import { retry } from "../../shared/retry.js";
import type { BuiltPrompt, PromptEmailInput } from "../prompt-builder/prompt.types.js";
import { GeminiRestClient, type GeminiClient } from "./gemini.client.js";
import { summaryResponseSchema, type SummaryResponse } from "./summary.schema.js";

export interface GeminiServiceConfig {
  apiKey?: string;
  model: string;
  retryAttempts: number;
  retryDelayMs: number;
}

export class GeminiService {
  private geminiClient?: GeminiClient;

  public constructor(
    private readonly config: GeminiServiceConfig = {
      apiKey: env.GEMINI_API_KEY,
      model: env.GEMINI_MODEL,
      retryAttempts: 3,
      retryDelayMs: 250
    },
    geminiClient?: GeminiClient
  ) {
    this.geminiClient = geminiClient;
  }

  public async summarize(prompt: BuiltPrompt): Promise<SummaryResponse> {
    if (prompt.emailCount === 0) {
      return {
        summaries: []
      };
    }

    const responseText = await retry(async () => await this.getClient().generateContent(prompt), {
      attempts: this.config.retryAttempts,
      delayMs: this.config.retryDelayMs,
      shouldRetry: isRetryableError
    });

    return this.parseAndValidate(responseText, prompt);
  }

  private getClient(): GeminiClient {
    if (!this.geminiClient) {
      if (!this.config.apiKey) {
        throw new AppError("GEMINI_API_KEY is required for Gemini summaries", 500);
      }

      logger.info({ model: this.config.model }, "Initializing Gemini client");
      this.geminiClient = new GeminiRestClient({
        apiKey: this.config.apiKey,
        model: this.config.model
      });
    }

    return this.geminiClient;
  }

  private parseAndValidate(responseText: string, prompt: BuiltPrompt): SummaryResponse {
    try {
      const parsedResponse = JSON.parse(stripJsonCodeFence(responseText)) as unknown;
      return summaryResponseSchema.parse(parsedResponse);
    } catch (error) {
      const details =
        error instanceof z.ZodError
          ? error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ")
          : error instanceof Error
            ? error.message
            : "Unknown parse error";

      logger.warn(
        {
          details,
          responsePreview: responseText.slice(0, 500)
        },
        "Gemini returned an invalid summary response"
      );

      const fallbackResponse = buildFallbackSummaryResponse(prompt);

      if (fallbackResponse.summaries.length > 0) {
        return fallbackResponse;
      }

      throw new AppError(`Gemini returned an invalid summary response: ${details}`, 502, true, {
        cause: error
      });
    }
  }
}

const buildFallbackSummaryResponse = (prompt: BuiltPrompt): SummaryResponse => {
  const promptEmails = extractPromptEmails(prompt.userPrompt);

  return {
    summaries: promptEmails.map((email) => ({
      emailId: email.id,
      priority: email.priority,
      sender: email.sender,
      subject: email.subject,
      summary: buildFallbackSummary(email),
      reason: email.reasonIncluded || email.snippet || "Included by email priority rules.",
      actionRequired: email.actionRequired,
      deadline: email.deadline ?? null,
      confidence: 0.5
    }))
  };
};

const extractPromptEmails = (userPrompt: string): PromptEmailInput[] => {
  const jsonStart = userPrompt.indexOf("[");
  const schemaStart = userPrompt.indexOf("\n\nReturn valid JSON", jsonStart);

  if (jsonStart === -1 || schemaStart === -1) {
    return [];
  }

  try {
    const parsedEmails = JSON.parse(userPrompt.slice(jsonStart, schemaStart)) as unknown;
    return z.array(promptEmailInputSchema).parse(parsedEmails);
  } catch {
    return [];
  }
};

const buildFallbackSummary = (email: PromptEmailInput): string => {
  const sourceText = email.snippet || email.bodyExcerpt || "No email preview was available.";
  return sourceText.length <= 180 ? sourceText : `${sourceText.slice(0, 180).trimEnd()}...`;
};

const promptEmailInputSchema = z.object({
  id: z.string().min(1),
  sender: z.string(),
  subject: z.string(),
  date: z.string(),
  snippet: z.string(),
  bodyExcerpt: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  category: z.enum([
    "action",
    "deadline",
    "important-contact",
    "normal",
    "newsletter",
    "otp",
    "promotion",
    "receipt",
    "spam"
  ]),
  actionRequired: z.boolean(),
  deadline: z.string().optional(),
  importantContact: z.boolean(),
  reasonIncluded: z.string()
});

const stripJsonCodeFence = (value: string): string =>
  value
    .trim()
    .replace(/^```json\s*/iu, "")
    .replace(/^```\s*/iu, "")
    .replace(/\s*```$/u, "");

const isRetryableError = (error: unknown): boolean => {
  if (!(error instanceof AppError)) {
    return true;
  }

  return error.statusCode === 408 || error.statusCode === 429 || error.statusCode >= 500;
};
