import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors.js";
import { logger } from "../../shared/logger.js";
import { retry } from "../../shared/retry.js";
import {
  DiscordWebhookClient,
  DiscordWebhookError,
  type DiscordDispatcherClient
} from "./discord-dispatcher.client.js";
import type {
  DeliveryResult,
  DiscordDispatcherConfig,
  DispatchRequest
} from "./dispatcher.types.js";

export class DiscordDispatcherService {
  private readonly client: DiscordDispatcherClient;

  public constructor(
    private readonly config: DiscordDispatcherConfig = {
      webhookUrl: env.DISCORD_WEBHOOK_URL,
      retryAttempts: 3,
      retryDelayMs: 250
    },
    client: DiscordDispatcherClient = new DiscordWebhookClient()
  ) {
    this.client = client;
  }

  public async dispatch(request: DispatchRequest): Promise<DeliveryResult> {
    const markdown = request.markdown.trim();

    if (!markdown) {
      return {
        status: "skipped",
        provider: "discord",
        deliveredAt: null,
        correlationId: request.correlationId,
        errorMessage: "Empty digest content"
      };
    }

    if (!this.config.webhookUrl) {
      return {
        status: "failed",
        provider: "discord",
        deliveredAt: null,
        correlationId: request.correlationId,
        errorMessage: "DISCORD_WEBHOOK_URL is required"
      };
    }

    try {
      const result = await retry(
        async () => await this.client.send(this.config.webhookUrl ?? "", markdown),
        {
          attempts: this.config.retryAttempts,
          delayMs: this.config.retryDelayMs,
          shouldRetry: isRetryableError,
          getDelayMs: getDiscordRetryDelayMs
        }
      );

      logger.info(
        {
          correlationId: request.correlationId,
          statusCode: result.statusCode
        },
        "Discord digest delivery succeeded"
      );

      return {
        status: "sent",
        provider: "discord",
        deliveredAt: new Date().toISOString(),
        correlationId: request.correlationId,
        statusCode: result.statusCode
      };
    } catch (error) {
      logger.error(
        {
          correlationId: request.correlationId,
          error
        },
        "Discord digest delivery failed"
      );

      return {
        status: "failed",
        provider: "discord",
        deliveredAt: null,
        correlationId: request.correlationId,
        statusCode: error instanceof AppError ? error.statusCode : undefined,
        errorMessage: error instanceof Error ? error.message : "Unknown Discord delivery error"
      };
    }
  }
}

const isRetryableError = (error: unknown): boolean => {
  if (!(error instanceof AppError)) {
    return true;
  }

  return error.statusCode === 408 || error.statusCode === 429 || error.statusCode >= 500;
};

const getDiscordRetryDelayMs = (error: unknown): number | undefined => {
  if (error instanceof DiscordWebhookError && error.retryAfterMs) {
    return error.retryAfterMs;
  }

  return undefined;
};
