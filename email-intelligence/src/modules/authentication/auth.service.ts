import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors.js";
import { GoogleOAuthClientAdapter } from "./google-oauth.client.js";
import { EnvFileRefreshTokenStore } from "./refresh-token.store.js";
import {
  loadAuthConfig,
  type AccessTokenResult,
  type GoogleOAuthClient,
  type RefreshTokenStore,
  type TokenExchangeResult
} from "./auth.types.js";

export class AuthService {
  private oauthClient?: GoogleOAuthClient;

  public constructor(
    oauthClient?: GoogleOAuthClient,
    private readonly refreshTokenStore: RefreshTokenStore = new EnvFileRefreshTokenStore()
  ) {
    this.oauthClient = oauthClient;
  }

  public getAuthorizationUrl(): string {
    return this.getOAuthClient().generateAuthUrl();
  }

  public async handleCallback(code: string | undefined): Promise<TokenExchangeResult> {
    if (!code) {
      throw new AppError("Missing Google OAuth authorization code", 400);
    }

    const tokenResult = await this.getOAuthClient().exchangeCode(code);
    const hasRefreshToken = Boolean(tokenResult.refreshToken);
    let refreshTokenStored = false;

    if (tokenResult.refreshToken) {
      await this.refreshTokenStore.save(tokenResult.refreshToken);
      refreshTokenStored = true;
    }

    return {
      status: "connected",
      provider: "google",
      scope: "gmail.readonly",
      hasRefreshToken,
      refreshTokenStored,
      refreshToken: tokenResult.refreshToken
    };
  }

  public async refreshAccessToken(): Promise<AccessTokenResult> {
    return await this.getOAuthClient().refreshAccessToken();
  }

  private getOAuthClient(): GoogleOAuthClient {
    this.oauthClient ??= new GoogleOAuthClientAdapter(loadAuthConfig(env));
    return this.oauthClient;
  }
}
