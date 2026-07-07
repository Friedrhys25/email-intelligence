import request from "supertest";
import { describe, expect, it } from "vitest";
import express from "express";
import { createGmailRouter } from "../../src/routes/gmail.routes.js";
import type { GmailService } from "../../src/modules/gmail/gmail.service.js";

describe("GET /gmail/latest", () => {
  it("returns normalized emails", async () => {
    const gmailService = {
      fetchLatestEmails: (_limit: number) =>
        Promise.resolve([
          {
            id: "message-1",
            threadId: "thread-1",
            sender: "GitHub <noreply@github.com>",
            subject: "Security alert",
            date: "2026-07-04T07:00:00.000Z",
            snippet: "Snippet",
            body: "Body",
            labels: ["INBOX"]
          }
        ])
    } as GmailService;
    const app = express();

    app.use(createGmailRouter(gmailService));

    const response = await request(app).get("/gmail/latest?limit=5").expect(200);

    expect(response.body).toEqual({
      count: 1,
      emails: [
        {
          id: "message-1",
          threadId: "thread-1",
          sender: "GitHub <noreply@github.com>",
          subject: "Security alert",
          date: "2026-07-04T07:00:00.000Z",
          snippet: "Snippet",
          body: "Body",
          labels: ["INBOX"]
        }
      ]
    });
  });
});
