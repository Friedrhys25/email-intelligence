# API - Authentication

## Endpoints

- `GET /auth/google`
  - Starts the Google OAuth2 flow.
  - Redirects the user to Google's consent screen.
- `GET /auth/google/callback`
  - Handles Google's OAuth2 callback.
  - Exchanges the authorization code for tokens.
  - Confirms whether a refresh token was received.

## Request

- `/auth/google` has no request body.
- `/auth/google/callback` receives `code` and `state` query parameters from Google.

## OAuth Scope

- Use least privilege: `https://www.googleapis.com/auth/gmail.readonly`.

## Response

- Start endpoint redirects to Google.
- Callback endpoint returns a simple setup status message for version 1.
- Never return raw access tokens or refresh tokens in HTTP responses.

Example callback response:

```json
{
  "status": "connected",
  "provider": "google",
  "scope": "gmail.readonly"
}
```

## Errors

- `400` when the callback is missing an authorization code.
- `401` when Google rejects the authorization code.
- `500` when token exchange fails unexpectedly.
- Log provider errors without exposing secrets.
