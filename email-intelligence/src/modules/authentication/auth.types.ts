import type { Env } from "../../config/env.js";

export const GMAIL_READONLY_SCOPE = "https://www.googleapis.com/auth/gmail.readonly";

export interface AuthConfig {
  googleClientId: string;
  googleClientSecret: string;
  googleRedirectUri: string;
  googleRefreshToken?: string;
}

export interface TokenExchangeResult {
  status: "connected";
  provider: "google";
  scope: "gmail.readonly";
  hasRefreshToken: boolean;
  refreshTokenStored: boolean;
  refreshToken?: string;
}

export interface AccessTokenResult {
  accessToken: string;
}

export interface OAuthTokenExchangeResult {
  refreshToken?: string;
}

export interface GoogleOAuthClient {
  generateAuthUrl(): string;
  exchangeCode(code: string): Promise<OAuthTokenExchangeResult>;
  refreshAccessToken(): Promise<AccessTokenResult>;
}

export interface RefreshTokenStore {
  save(refreshToken: string): Promise<void>;
}

export const loadAuthConfig = (env: Env): AuthConfig => {
  const googleClientId = env.GOOGLE_CLIENT_ID;
  const googleClientSecret = env.GOOGLE_CLIENT_SECRET;
  const googleRedirectUri = env.GOOGLE_REDIRECT_URI;
  const missing: string[] = [];

  if (!googleClientId) {
    missing.push("GOOGLE_CLIENT_ID");
  }

  if (!googleClientSecret) {
    missing.push("GOOGLE_CLIENT_SECRET");
  }

  if (!googleRedirectUri) {
    missing.push("GOOGLE_REDIRECT_URI");
  }

  if (missing.length > 0 || !googleClientId || !googleClientSecret || !googleRedirectUri) {
    throw new Error(`Missing Google OAuth configuration: ${missing.join(", ")}`);
  }

  return {
    googleClientId,
    googleClientSecret,
    googleRedirectUri,
    googleRefreshToken: env.GOOGLE_REFRESH_TOKEN
  };
};
