# Testing Strategy

## Goals

- Prove module behavior without depending on live external services.
- Catch regressions in filtering, priority classification, prompt construction, formatting, and scheduling.
- Keep live Gmail, Gemini, and Discord tests optional and clearly separated.

## Unit Tests

- Authentication URL construction and callback errors.
- Gmail mapper behavior.
- Email filtering and priority rules.
- Prompt Builder output.
- Gemini response parsing and validation.
- Formatter Markdown output.
- Dispatcher request handling.
- Scheduler lock behavior.
- Orchestrator control flow.

## Integration Tests

- Express health route.
- Auth route wiring with mocked Google client.
- Gmail service with mocked Gmail API.
- Gemini service with mocked provider response.
- Discord dispatcher with mocked webhook.
- Full orchestrator with mocked module services.

## External Tests

Live external tests are optional and should be skipped by default unless the required env vars are present.

## Coverage Priorities

- Security-sensitive token handling.
- Filtering decisions.
- Error handling and retries.
- Scheduler duplicate prevention.
- Markdown output shape.
