# Authentication Prompt

## Context

Inbox Intelligence needs a one-user Google OAuth2 setup that grants Gmail read-only access and supports scheduled runs through a refresh token.

## Goal

Implement the authentication module.

## Requirements

- Create Google OAuth2 authorization URL.
- Request `https://www.googleapis.com/auth/gmail.readonly`.
- Implement callback code exchange.
- Support access-token refresh with a stored refresh token.
- Validate required Google OAuth environment variables.
- Redact credentials in logs.

## Deliverables

- Auth routes/controller.
- Auth service.
- Google OAuth client wrapper.
- Auth types.
- Unit tests.

## Acceptance Criteria

- `/auth/google` redirects to Google.
- `/auth/google/callback` handles code exchange.
- Refresh-token flow works for Gmail API calls.
- Secrets are never returned or logged.

### Prompt Template

```text
Using the System Prompt, implement the authentication module for Inbox Intelligence. Build Google OAuth2 start and callback flows, request Gmail read-only scope, support refresh-token based scheduled runs, validate configuration, redact secrets, and include focused tests.
```
