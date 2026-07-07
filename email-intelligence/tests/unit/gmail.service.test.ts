import { describe, expect, it, vi } from "vitest";
import { GmailService, type AccessTokenProvider } from "../../src/modules/gmail/gmail.service.js";
import type { GmailClient } from "../../src/modules/gmail/gmail.client.js";

describe("GmailService", () => {
  it("fetches latest messages and normalizes them", async () => {
    const accessTokenProvider: AccessTokenProvider = {
      refreshAccessToken: vi.fn(() => Promise.resolve({ accessToken: "access-token" }))
    };
    const listLatestMessages = vi.fn(() =>
      Promise.resolve({
        messages: [{ id: "message-1" }]
      })
    );
    const getMessage = vi.fn(() =>
      Promise.resolve({
        id: "message-1",
        threadId: "thread-1",
        snippet: "Snippet",
        payload: {
          headers: [{ name: "Subject", value: "Hello" }]
        }
      })
    );
    const gmailClient: GmailClient = {
      listLatestMessages,
      getMessage
    };

    const service = new GmailService(accessTokenProvider, gmailClient);

    await expect(service.fetchLatestEmails(5)).resolves.toMatchObject([
      {
        id: "message-1",
        subject: "Hello",
        snippet: "Snippet"
      }
    ]);
    expect(listLatestMessages).toHaveBeenCalledWith("access-token", 5);
    expect(getMessage).toHaveBeenCalledWith("access-token", "message-1");
  });

  it("continues when a single message fetch fails", async () => {
    const accessTokenProvider: AccessTokenProvider = {
      refreshAccessToken: vi.fn(() => Promise.resolve({ accessToken: "access-token" }))
    };
    const gmailClient: GmailClient = {
      listLatestMessages: vi.fn(() =>
        Promise.resolve({
          messages: [{ id: "message-1" }, { id: "message-2" }]
        })
      ),
      getMessage: vi
        .fn()
        .mockRejectedValueOnce(new Error("failed"))
        .mockResolvedValueOnce({
          id: "message-2",
          threadId: "thread-2",
          snippet: "Second",
          payload: {
            headers: []
          }
        })
    };

    const service = new GmailService(accessTokenProvider, gmailClient);

    await expect(service.fetchLatestEmails(5)).resolves.toHaveLength(1);
  });
});
