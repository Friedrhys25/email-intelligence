# Authentication

## Purpose

Authenticate with Google OAuth2 and provide valid Gmail API credentials for scheduled digest runs.

## Responsibilities

- Build the Google OAuth2 authorization URL.
- Request Gmail read-only scope.
- Handle the OAuth2 callback.
- Exchange authorization codes for tokens.
- Store or load refresh-token configuration securely.
- Refresh access tokens automatically.
- Hide token details from controllers and other modules.

## Inputs

- Google client ID.
- Google client secret.
- Google redirect URI.
- OAuth callback authorization code.
- Stored refresh token.

## Outputs

- Authorized Gmail client or access-token provider.
- Safe connection status for setup/debug responses.

## Flow

1. User opens `/auth/google`.
2. App redirects to Google consent screen.
3. User grants Gmail read-only access.
4. Google redirects to `/auth/google/callback`.
5. App exchanges code for tokens.
6. Refresh token is stored as a protected secret.
7. Scheduled jobs use the refresh token to obtain access tokens.

## Acceptance Criteria

- Uses `gmail.readonly` scope.
- Refreshes expired access tokens without user action.
- Never logs or returns secrets.
- Fails clearly when required env vars are missing.

## Testing Checklist

- Authorization URL includes expected scope.
- Callback rejects missing code.
- Token exchange errors are handled.
- Access-token refresh path is covered.
- Secrets are redacted from logs.
