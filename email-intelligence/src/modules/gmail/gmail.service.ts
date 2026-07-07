import { env } from "../../config/env.js";
import { AuthService } from "../authentication/auth.service.js";
import { logger } from "../../shared/logger.js";
import type { EmailDTO, GmailMessageReference } from "./email.dto.js";
import { GmailRestClient, type GmailClient } from "./gmail.client.js";
import { mapGmailMessageToEmailDTO } from "./gmail.mapper.js";

const unreadInboxQuery = "in:inbox is:unread";

export interface AccessTokenProvider {
  refreshAccessToken(): Promise<{ accessToken: string }>;
}

export class GmailService {
  public constructor(
    private readonly accessTokenProvider: AccessTokenProvider = new AuthService(),
    private readonly gmailClient: GmailClient = new GmailRestClient()
  ) {}

  public async fetchLatestEmails(limit = env.EMAIL_FETCH_LIMIT): Promise<EmailDTO[]> {
    const { accessToken } = await this.accessTokenProvider.refreshAccessToken();
    const messageList = await this.gmailClient.listLatestMessages(
      accessToken,
      limit,
      unreadInboxQuery
    );
    const messageReferences = this.getValidMessageReferences(messageList.messages ?? []);

    const settledMessages = await Promise.allSettled(
      messageReferences.map(
        async (message) => await this.gmailClient.getMessage(accessToken, message.id)
      )
    );

    return settledMessages.flatMap((result, index) => {
      if (result.status === "fulfilled") {
        return [mapGmailMessageToEmailDTO(result.value)];
      }

      logger.warn(
        {
          error: result.reason,
          messageId: messageReferences[index]?.id
        },
        "Skipping Gmail message after fetch failure"
      );

      return [];
    });
  }

  private getValidMessageReferences(messages: GmailMessageReference[]): { id: string }[] {
    return messages.flatMap((message) => (message.id ? [{ id: message.id }] : []));
  }
}
