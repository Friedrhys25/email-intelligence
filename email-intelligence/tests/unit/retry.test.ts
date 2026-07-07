import { describe, expect, it, vi } from "vitest";
import { retry } from "../../src/shared/retry.js";

describe("retry", () => {
  it("returns the operation result when it succeeds", async () => {
    await expect(
      retry(() => Promise.resolve("ok"), {
        attempts: 2,
        delayMs: 0
      })
    ).resolves.toBe("ok");
  });

  it("retries failed operations until success", async () => {
    const operation = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error("temporary"))
      .mockResolvedValueOnce("ok");

    await expect(
      retry(operation, {
        attempts: 2,
        delayMs: 0
      })
    ).resolves.toBe("ok");

    expect(operation).toHaveBeenCalledTimes(2);
  });
});
