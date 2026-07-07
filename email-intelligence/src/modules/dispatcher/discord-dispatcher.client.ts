import { AppError } from "../../shared/errors.js";

export interface DiscordDispatcherClient {
  send(webhookUrl: string, markdown: string): Promise<{ statusCode: number }>;
}

export class DiscordWebhookError extends AppError {
  public constructor(
    message: string,
    statusCode: number,
    public readonly retryAfterMs?: number
  ) {
    super(message, statusCode);
  }
}

interface DiscordRateLimitResponse {
  message?: string;
  retry_after?: number;
  global?: boolean;
}

export class DiscordWebhookClient implements DiscordDispatcherClient {
  public async send(webhookUrl: string, markdown: string): Promise<{ statusCode: number }> {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: markdown,
        allowed_mentions: {
          parse: []
        }
      })
    });

    if (!response.ok) {
      const responseBody = await response.text();
      const retryAfterMs = getRetryAfterMs(response, responseBody);
      const message = [
        `Discord webhook request failed with status ${String(response.status)}`,
        responseBody ? `body: ${responseBody.slice(0, 300)}` : undefined,
        retryAfterMs ? `retryAfterMs: ${String(retryAfterMs)}` : undefined
      ]
        .filter(Boolean)
        .join("; ");

      throw new DiscordWebhookError(message, response.status, retryAfterMs);
    }

    return {
      statusCode: response.status
    };
  }
}

const getRetryAfterMs = (response: Response, responseBody: string): number | undefined => {
  const bodyRetryAfterMs = getBodyRetryAfterMs(responseBody);
  if (bodyRetryAfterMs) {
    return bodyRetryAfterMs;
  }

  const retryAfterSeconds = Number(response.headers.get("retry-after"));
  if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
    return Math.ceil(retryAfterSeconds * 1000);
  }

  const resetAfterSeconds = Number(response.headers.get("x-ratelimit-reset-after"));
  if (Number.isFinite(resetAfterSeconds) && resetAfterSeconds > 0) {
    return Math.ceil(resetAfterSeconds * 1000);
  }

  return undefined;
};

const getBodyRetryAfterMs = (responseBody: string): number | undefined => {
  try {
    const parsedBody = JSON.parse(responseBody) as DiscordRateLimitResponse;
    const retryAfterSeconds = parsedBody.retry_after;

    if (typeof retryAfterSeconds === "number" && retryAfterSeconds > 0) {
      return Math.ceil(retryAfterSeconds * 1000);
    }
  } catch {
    return undefined;
  }

  return undefined;
};
