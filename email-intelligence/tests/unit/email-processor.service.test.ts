import { describe, expect, it } from "vitest";
import type { EmailDTO } from "../../src/modules/gmail/email.dto.js";
import { EmailProcessorService } from "../../src/modules/email-processor/email-processor.service.js";

const createEmail = (overrides: Partial<EmailDTO>): EmailDTO => ({
  id: "message-1",
  threadId: "thread-1",
  sender: "sender@example.com",
  subject: "Hello",
  date: "2026-07-04T07:00:00.000Z",
  snippet: "",
  body: "",
  labels: ["INBOX"],
  ...overrides
});

describe("EmailProcessorService", () => {
  it("ignores OTP emails", () => {
    const service = new EmailProcessorService();
    const emails = [
      createEmail({
        subject: "Your verification code",
        body: "Your OTP is 123456."
      })
    ];

    expect(service.process(emails)).toEqual([]);
  });

  it("ignores promotional emails", () => {
    const service = new EmailProcessorService();
    const emails = [
      createEmail({
        subject: "Limited time sale",
        body: "Get 50% off today."
      })
    ];

    expect(service.process(emails)).toEqual([]);
  });

  it("ignores newsletters when configured", () => {
    const service = new EmailProcessorService({
      ignoreNewsletters: true,
      importantContacts: []
    });
    const emails = [
      createEmail({
        subject: "Weekly newsletter",
        body: "Unsubscribe from this weekly digest."
      })
    ];

    expect(service.process(emails)).toEqual([]);
  });

  it("keeps newsletters when newsletter filtering is disabled", () => {
    const service = new EmailProcessorService({
      ignoreNewsletters: false,
      importantContacts: []
    });
    const emails = [
      createEmail({
        subject: "Weekly newsletter",
        body: "Unsubscribe from this weekly digest."
      })
    ];

    expect(service.process(emails)).toHaveLength(1);
  });

  it("detects action-required emails", () => {
    const service = new EmailProcessorService();
    const [processedEmail] = service.process([
      createEmail({
        subject: "Action required",
        body: "Please review the deployment settings."
      })
    ]);

    expect(processedEmail).toMatchObject({
      actionRequired: true,
      category: "action",
      priority: "medium"
    });
  });

  it("detects deadlines and classifies them as high priority when action is required", () => {
    const service = new EmailProcessorService();
    const [processedEmail] = service.process([
      createEmail({
        sender: "GitHub <noreply@github.com>",
        subject: "Security alert",
        body: "Please review and fix this dependency by tomorrow."
      })
    ]);

    expect(processedEmail).toMatchObject({
      actionRequired: true,
      deadline: "tomorrow",
      importantContact: true,
      category: "deadline",
      priority: "high"
    });
  });

  it("detects configured important contacts", () => {
    const service = new EmailProcessorService({
      ignoreNewsletters: true,
      importantContacts: ["client.com"]
    });
    const [processedEmail] = service.process([
      createEmail({
        sender: "Client <lead@client.com>",
        subject: "Project update"
      })
    ]);

    expect(processedEmail).toMatchObject({
      importantContact: true,
      category: "important-contact",
      priority: "medium"
    });
  });

  it("classifies normal emails as low priority", () => {
    const service = new EmailProcessorService();
    const [processedEmail] = service.process([
      createEmail({
        subject: "FYI",
        body: "Sharing notes from the meeting."
      })
    ]);

    expect(processedEmail).toMatchObject({
      category: "normal",
      priority: "low"
    });
  });
});
