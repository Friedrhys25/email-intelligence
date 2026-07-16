import { describe, expect, it, vi } from "vitest";
import { AppError } from "../../src/shared/errors.js";
import { AuthService } from "../../src/modules/authentication/auth.service.js";
import {
  GMAIL_READONLY_SCOPE,
  loadAuthConfig
} from "../../src/modules/authentication/auth.types.js";
import type {
  GoogleOAuthClient,
  OAuthTokenExchangeResult,
  RefreshTokenStore
} from "../../src/modules/authentication/auth.types.js";

interface OAuthClientTestDouble {
  client: GoogleOAuthClient;
  generateAuthUrl: ReturnType<typeof vi.fn<() => string>>;
  exchangeCode: ReturnType<typeof vi.fn<(code: string) => Promise<OAuthTokenExchangeResult>>>;
  refreshAccessToken: ReturnType<typeof vi.fn<() => Promise<{ accessToken: string }>>>;
  refreshTokenStore: RefreshTokenStore;
  saveRefreshToken: ReturnType<typeof vi.fn<(refreshToken: string) => Promise<void>>>;
}

const createOAuthClient = (): OAuthClientTestDouble => {
  const tokenExchangeResult: OAuthTokenExchangeResult = {
    refreshToken: "refresh-token"
  };
  const generateAuthUrl = vi.fn(
    () => `https://accounts.google.com/o/oauth2/v2/auth?scope=${GMAIL_READONLY_SCOPE}`
  );
  const exchangeCode = vi.fn((_: string) => Promise.resolve(tokenExchangeResult));
  const refreshAccessToken = vi.fn(() =>
    Promise.resolve({
      accessToken: "access-token"
    })
  );
  const saveRefreshToken = vi.fn((_: string) => Promise.resolve());

  return {
    client: {
      generateAuthUrl,
      exchangeCode,
      refreshAccessToken
    },
    generateAuthUrl,
    exchangeCode,
    refreshAccessToken,
    refreshTokenStore: {
      save: saveRefreshToken
    },
    saveRefreshToken
  };
};

describe("AuthService", () => {
  it("returns the Google authorization URL with Gmail read-only scope", () => {
    const oauthClient = createOAuthClient();
    const service = new AuthService(oauthClient.client, oauthClient.refreshTokenStore);

    expect(service.getAuthorizationUrl()).toContain(GMAIL_READONLY_SCOPE);
    expect(oauthClient.generateAuthUrl).toHaveBeenCalledOnce();
  });

  it("rejects callbacks without an authorization code", async () => {
    const oauthClient = createOAuthClient();
    const service = new AuthService(oauthClient.client);

    await expect(service.handleCallback(undefined)).rejects.toMatchObject({
      message: "Missing Google OAuth authorization code",
      statusCode: 400
    } satisfies Partial<AppError>);
  });

  it("exchanges callback codes and stores the refresh token", async () => {
    const oauthClient = createOAuthClient();
    const service = new AuthService(oauthClient.client, oauthClient.refreshTokenStore);

    await expect(service.handleCallback("auth-code")).resolves.toEqual({
      status: "connected",
      provider: "google",
      scope: "gmail.readonly",
      hasRefreshToken: true,
      refreshTokenStored: true,
      refreshToken: "refresh-token"
    });

    expect(oauthClient.exchangeCode).toHaveBeenCalledWith("auth-code");
    expect(oauthClient.saveRefreshToken).toHaveBeenCalledWith("refresh-token");
  });

  it("refreshes access tokens through the OAuth client", async () => {
    const oauthClient = createOAuthClient();
    const service = new AuthService(oauthClient.client);

    await expect(service.refreshAccessToken()).resolves.toEqual({
      accessToken: "access-token"
    });
  });
});

describe("loadAuthConfig", () => {
  it("fails clearly when required Google OAuth env vars are missing", () => {
    expect(() =>
      loadAuthConfig({
        NODE_ENV: "development",
        PORT: 3000,
        LOG_LEVEL: "info",
        EXPOSE_REFRESH_TOKEN_ON_CALLBACK: false,
        EMAIL_FETCH_LIMIT: 10,
        DIGEST_CRON: "0 10,21 * * *",
        SCHEDULER_TIMEZONE: "Asia/Manila",
        SCHEDULER_ENABLED: false
      })
    ).toThrow(
      "Missing Google OAuth configuration: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI"
    );
  });
});
