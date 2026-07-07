import { AppError } from "../../shared/errors.js";
import type { GmailMessage, GmailMessageList } from "./email.dto.js";

export interface GmailClient {
  listLatestMessages(accessToken: string, limit: number): Promise<GmailMessageList>;
  getMessage(accessToken: string, messageId: string): Promise<GmailMessage>;
}

export class GmailRestClient implements GmailClient {
  private readonly baseUrl = "https://gmail.googleapis.com/gmail/v1/users/me";

  public async listLatestMessages(accessToken: string, limit: number): Promise<GmailMessageList> {
    const url = new URL(`${this.baseUrl}/messages`);
    url.searchParams.set("maxResults", String(limit));

    return await this.request<GmailMessageList>(accessToken, url);
  }

  public async getMessage(accessToken: string, messageId: string): Promise<GmailMessage> {
    const url = new URL(`${this.baseUrl}/messages/${messageId}`);
    url.searchParams.set("format", "full");

    return await this.request<GmailMessage>(accessToken, url);
  }

  private async request<T>(accessToken: string, url: URL): Promise<T> {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new AppError(
        `Gmail API request failed with status ${String(response.status)}`,
        response.status
      );
    }

    return (await response.json()) as T;
  }
}
