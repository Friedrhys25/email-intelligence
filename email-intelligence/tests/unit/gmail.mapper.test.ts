import { describe, expect, it } from "vitest";
import { mapGmailMessageToEmailDTO } from "../../src/modules/gmail/gmail.mapper.js";
import type { GmailMessage } from "../../src/modules/gmail/email.dto.js";

const encodeBase64Url = (value: string): string =>
  Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/u, "");

describe("mapGmailMessageToEmailDTO", () => {
  it("maps Gmail headers and text body into EmailDTO", () => {
    const message: GmailMessage = {
      id: "message-1",
      threadId: "thread-1",
      labelIds: ["INBOX"],
      snippet: "Snippet",
      payload: {
        headers: [
          { name: "From", value: "GitHub <noreply@github.com>" },
          { name: "Subject", value: "Security alert" },
          { name: "Date", value: "Sat, 04 Jul 2026 07:00:00 +0000" }
        ],
        parts: [
          {
            mimeType: "text/plain",
            body: {
              data: encodeBase64Url("A dependency vulnerability was detected.")
            }
          }
        ]
      }
    };

    expect(mapGmailMessageToEmailDTO(message)).toEqual({
      id: "message-1",
      threadId: "thread-1",
      sender: "GitHub <noreply@github.com>",
      subject: "Security alert",
      date: "2026-07-04T07:00:00.000Z",
      snippet: "Snippet",
      body: "A dependency vulnerability was detected.",
      labels: ["INBOX"]
    });
  });

  it("falls back to snippet when body content is unavailable", () => {
    expect(
      mapGmailMessageToEmailDTO({
        id: "message-1",
        threadId: "thread-1",
        snippet: "Snippet fallback",
        payload: {
          headers: []
        }
      }).body
    ).toBe("Snippet fallback");
  });
});
