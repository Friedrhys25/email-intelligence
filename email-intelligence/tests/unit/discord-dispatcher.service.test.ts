import { describe, expect, it, vi } from "vitest";
import { AppError } from "../../src/shared/errors.js";
import { DiscordDispatcherService } from "../../src/modules/dispatcher/discord-dispatcher.service.js";
import type { DiscordDispatcherClient } from "../../src/modules/dispatcher/discord-dispatcher.client.js";

const testWebhookUrl = "https://discord.com/api/webhooks/test";

const createService = (client: DiscordDispatcherClient, webhookUrl?: string) =>
  new DiscordDispatcherService(
    {
      webhookUrl,
      retryAttempts: 2,
      retryDelayMs: 0
    },
    client
  );

describe("DiscordDispatcherService", () => {
  it("sends Markdown to Discord and returns delivery status", async () => {
    const send = vi.fn(() => Promise.resolve({ statusCode: 204 }));
    const service = createService({ send }, testWebhookUrl);

    const result = await service.dispatch({
      markdown: "# Inbox Intelligence",
      correlationId: "run-1"
    });

    expect(send).toHaveBeenCalledWith(testWebhookUrl, "# Inbox Intelligence");
    expect(result).toMatchObject({
      status: "sent",
      provider: "discord",
      correlationId: "run-1",
      statusCode: 204
    });
    expect(result.deliveredAt).toEqual(expect.any(String));
  });

  it("skips empty digest content", async () => {
    const send = vi.fn(() => Promise.resolve({ statusCode: 204 }));
    const service = createService({ send }, testWebhookUrl);

    await expect(
      service.dispatch({
        markdown: "   ",
        correlationId: "run-1"
      })
    ).resolves.toMatchObject({
      status: "skipped",
      errorMessage: "Empty digest content"
    });
    expect(send).not.toHaveBeenCalled();
  });

  it("returns a failed result when webhook URL is missing", async () => {
    const send = vi.fn(() => Promise.resolve({ statusCode: 204 }));
    const service = createService({ send }, undefined);

    await expect(
      service.dispatch({
        markdown: "# Inbox Intelligence",
        correlationId: "run-1"
      })
    ).resolves.toMatchObject({
      status: "failed",
      errorMessage: "DISCORD_WEBHOOK_URL is required"
    });
    expect(send).not.toHaveBeenCalled();
  });

  it("retries transient Discord failures", async () => {
    const send = vi
      .fn<DiscordDispatcherClient["send"]>()
      .mockRejectedValueOnce(new AppError("rate limited", 429))
      .mockResolvedValueOnce({ statusCode: 204 });
    const service = createService({ send }, testWebhookUrl);

    await expect(
      service.dispatch({
        markdown: "# Inbox Intelligence",
        correlationId: "run-1"
      })
    ).resolves.toMatchObject({
      status: "sent",
      statusCode: 204
    });
    expect(send).toHaveBeenCalledTimes(2);
  });

  it("does not retry permanent Discord failures", async () => {
    const send = vi
      .fn<DiscordDispatcherClient["send"]>()
      .mockRejectedValue(new AppError("bad request", 400));
    const service = createService({ send }, testWebhookUrl);

    await expect(
      service.dispatch({
        markdown: "# Inbox Intelligence",
        correlationId: "run-1"
      })
    ).resolves.toMatchObject({
      status: "failed",
      statusCode: 400,
      errorMessage: "bad request"
    });
    expect(send).toHaveBeenCalledTimes(1);
  });
});
