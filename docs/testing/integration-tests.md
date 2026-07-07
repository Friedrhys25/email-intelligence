# Integration Tests

## API

- `GET /health` returns `200` and service metadata.
- `GET /auth/google` redirects to Google with expected scope.
- `GET /auth/google/callback` delegates to auth service and returns safe status.
- `GET /gmail/latest` returns normalized EmailDTO data when enabled for development.
- `POST /gmail/digest/run` triggers orchestrator when enabled/protected.

## Gmail

- Mock Gmail API message list and message detail calls.
- Verify latest-message limit is passed.
- Verify provider responses become EmailDTO objects.

## Gemini

- Mock Gemini success and failure responses.
- Verify prompts are sent and structured output is validated.

## Discord

- Mock Discord webhook success.
- Mock retryable and permanent failures.
- Verify webhook URL is not printed in logs.

## Full Digest Flow

- Mock Gmail to return ten unread emails.
- Mock processor to include important messages.
- Mock Gemini to return summaries.
- Mock dispatcher to accept Markdown.
- Assert run result includes fetched count, included count, dispatch status, and completion status.

## Live Smoke Tests

Run only when explicit environment variables are present:

- Gmail fetch smoke test.
- Gemini summary smoke test.
- Discord test delivery.
