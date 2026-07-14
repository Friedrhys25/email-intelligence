import { AppError } from "../../shared/errors.js";

export interface DiscordDispatcherClient {
  send(webhookUrl: string, markdown: string): Promise<{ statusCode: number }>;
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
      throw new AppError(
        `Discord webhook request failed with status ${String(response.status)}`,
        response.status
      );
    }

    return {
      statusCode: response.status
    };
  }
}
