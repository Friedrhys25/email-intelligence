import { describe, expect, it } from "vitest";
import { loadEnv } from "../../src/config/env.js";

describe("loadEnv", () => {
  it("loads defaults for Phase 1 runtime settings", () => {
    const result = loadEnv({});

    expect(result.NODE_ENV).toBe("development");
    expect(result.PORT).toBe(3000);
    expect(result.LOG_LEVEL).toBe("info");
    expect(result.EMAIL_FETCH_LIMIT).toBe(10);
    expect(result.DIGEST_CRON).toBe("0 10,21 * * *");
    expect(result.SCHEDULER_TIMEZONE).toBe("Asia/Manila");
    expect(result.GEMINI_MODEL).toBe("gemini-flash-latest");
  });

  it("rejects invalid URLs for future external integrations", () => {
    expect(() =>
      loadEnv({
        DISCORD_WEBHOOK_URL: "not-a-url"
      })
    ).toThrow("Invalid environment configuration");
  });

  it("requires integration secrets in production", () => {
    expect(() =>
      loadEnv({
        NODE_ENV: "production",
        GOOGLE_REDIRECT_URI: "https://example.com/auth/google/callback",
        DISCORD_WEBHOOK_URL: "https://discord.com/api/webhooks/example"
      })
    ).toThrow("Required in production");
  });

  it("accepts a complete production deployment configuration", () => {
    const result = loadEnv({
      NODE_ENV: "production",
      GOOGLE_CLIENT_ID: "client-id",
      GOOGLE_CLIENT_SECRET: "client-secret",
      GOOGLE_REDIRECT_URI: "https://example.com/auth/google/callback",
      GOOGLE_REFRESH_TOKEN: "refresh-token",
      GEMINI_API_KEY: "gemini-key",
      DISCORD_WEBHOOK_URL: "https://discord.com/api/webhooks/example",
      SCHEDULER_ENABLED: "true"
    });

    expect(result.NODE_ENV).toBe("production");
    expect(result.SCHEDULER_ENABLED).toBe(true);
  });
});
