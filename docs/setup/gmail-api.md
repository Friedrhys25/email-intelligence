# Gmail API

## Purpose

Enable Inbox Intelligence to read recent Gmail messages through the Gmail API.

## Prerequisites

- Google Cloud setup complete.
- Gmail API enabled.
- OAuth2 credentials configured.
- Refresh token available after consent.

## Step-by-step

1. Request the `https://www.googleapis.com/auth/gmail.readonly` scope.
2. Complete OAuth flow through `/auth/google`.
3. Confirm callback receives tokens.
4. Store the refresh token securely.
5. Use the refresh token to create an authorized Gmail client.
6. Fetch recent message IDs with a default limit of `5`.
7. Fetch message details and normalize into EmailDTO.

## Common Errors

- No refresh token returned: force consent during setup and ensure offline access is requested.
- Missing Gmail API enablement: enable it in Google Cloud.
- Rate limits: retry transient failures and keep fetch limits low.
- Missing body: use snippet fallback when body content is unavailable.

## Checklist

- Read-only scope is used.
- Latest five emails can be fetched.
- EmailDTO mapping works.
- Missing headers are handled.
- Sensitive email content is not logged by default.
