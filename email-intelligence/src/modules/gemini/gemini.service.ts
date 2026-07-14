import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors.js";
import { logger } from "../../shared/logger.js";
import { retry } from "../../shared/retry.js";
import type { BuiltPrompt } from "../prompt-builder/prompt.types.js";
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

    return this.parseAndValidate(responseText);
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

  private parseAndValidate(responseText: string): SummaryResponse {
    try {
      const parsedResponse = JSON.parse(stripJsonCodeFence(responseText)) as unknown;
      return summaryResponseSchema.parse(parsedResponse);
    } catch (error) {
      throw new AppError("Gemini returned an invalid summary response", 502, true, {
        cause: error
      });
    }
  }
}

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
