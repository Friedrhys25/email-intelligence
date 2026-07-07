import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { createApp } from "../../src/app.js";
import { AuthService } from "../../src/modules/authentication/auth.service.js";

describe("authentication routes", () => {
  it("redirects to the Google authorization URL", async () => {
    vi.spyOn(AuthService.prototype, "getAuthorizationUrl").mockReturnValueOnce(
      "https://accounts.google.com/o/oauth2/v2/auth"
    );

    const response = await request(createApp()).get("/auth/google").expect(302);

    expect(response.headers.location).toBe("https://accounts.google.com/o/oauth2/v2/auth");
  });

  it("returns 400 when callback code is missing", async () => {
    const response = await request(createApp()).get("/auth/google/callback").expect(400);

    expect(response.body).toEqual({
      error: {
        message: "Missing Google OAuth authorization code"
      }
    });
  });

  it("returns safe connection status from the callback", async () => {
    vi.spyOn(AuthService.prototype, "handleCallback").mockResolvedValueOnce({
      status: "connected",
      provider: "google",
      scope: "gmail.readonly",
      hasRefreshToken: true,
      refreshTokenStored: true
    });

    const response = await request(createApp()).get("/auth/google/callback?code=abc").expect(200);

    expect(response.body).toEqual({
      status: "connected",
      provider: "google",
      scope: "gmail.readonly",
      hasRefreshToken: true,
      refreshTokenStored: true
    });
  });
});
