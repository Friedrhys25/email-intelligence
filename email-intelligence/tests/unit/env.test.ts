import { describe, expect, it } from "vitest";
import { loadEnv } from "../../src/config/env.js";

describe("loadEnv", () => {
  it("loads defaults for Phase 1 runtime settings", () => {
    const result = loadEnv({});

    expect(result.NODE_ENV).toBe("development");
    expect(result.PORT).toBe(3000);
    expect(result.LOG_LEVEL).toBe("info");
    expect(result.EMAIL_FETCH_LIMIT).toBe(5);
  });

  it("rejects invalid URLs for future external integrations", () => {
    expect(() =>
      loadEnv({
        DISCORD_WEBHOOK_URL: "not-a-url"
      })
    ).toThrow("Invalid environment configuration");
  });
});
