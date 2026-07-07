import { OAuth2Client } from "google-auth-library";
import { AppError } from "../../shared/errors.js";
import {
  GMAIL_READONLY_SCOPE,
  type AccessTokenResult,
  type AuthConfig,
  type GoogleOAuthClient,
  type OAuthTokenExchangeResult
} from "./auth.types.js";

export class GoogleOAuthClientAdapter implements GoogleOAuthClient {
  private readonly oauthClient: OAuth2Client;

  public constructor(private readonly config: AuthConfig) {
    this.oauthClient = new OAuth2Client(
      config.googleClientId,
      config.googleClientSecret,
      config.googleRedirectUri
    );
  }

  public generateAuthUrl(): string {
    return this.oauthClient.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [GMAIL_READONLY_SCOPE]
    });
  }

  public async exchangeCode(code: string): Promise<OAuthTokenExchangeResult> {
    try {
      const { tokens } = await this.oauthClient.getToken(code);

      return {
        refreshToken: tokens.refresh_token ?? undefined
      };
    } catch (error) {
      throw new AppError("Google OAuth token exchange failed", 401, true, { cause: error });
    }
  }

  public async refreshAccessToken(): Promise<AccessTokenResult> {
    if (!this.config.googleRefreshToken) {
      throw new AppError("GOOGLE_REFRESH_TOKEN is required to refresh access tokens", 401);
    }

    this.oauthClient.setCredentials({
      refresh_token: this.config.googleRefreshToken
    });

    try {
      const response = await this.oauthClient.getAccessToken();

      if (!response.token) {
        throw new AppError("Google OAuth did not return an access token", 401);
      }

      return {
        accessToken: response.token
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError("Google OAuth access token refresh failed", 401, true, { cause: error });
    }
  }
}
