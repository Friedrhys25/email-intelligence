# Google Cloud

## Purpose

Configure the Google project required for OAuth2 and Gmail API access.

## Prerequisites

- Google account.
- Access to Google Cloud Console.
- Local callback URL, for example `http://localhost:3000/auth/google/callback`.
- Production callback URL from Render after deployment.

## Step-by-step

1. Create a Google Cloud project named `Inbox Intelligence`.
2. Configure OAuth consent screen.
3. Set app type to external for personal testing unless using a Workspace internal app.
4. Add the developer email as a test user.
5. Enable the Gmail API.
6. Create OAuth client credentials for a web application.
7. Add authorized redirect URIs:
   - Local callback URL.
   - Render callback URL.
8. Store client ID and client secret in environment variables.

## Common Errors

- Redirect URI mismatch: the callback URL must match exactly.
- App not verified: add yourself as a test user while the app is in testing.
- Wrong OAuth scope: use Gmail read-only scope for version 1.

## Checklist

- Google Cloud project exists.
- OAuth consent screen is configured.
- Gmail API is enabled.
- OAuth web client exists.
- Local redirect URI is configured.
- Production redirect URI is configured.
- Client ID and secret are stored outside git.
