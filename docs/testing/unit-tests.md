# Unit Tests

## Authentication

- Builds Google authorization URL with Gmail read-only scope.
- Rejects missing callback code.
- Redacts secrets in errors/logs.
- Refreshes access token through stored refresh token.

## Gmail

- Maps Gmail headers into EmailDTO.
- Handles missing sender, subject, date, and body.
- Uses snippet fallback.
- Continues after a single message fetch failure.

## Email Processor

- Ignores OTPs.
- Ignores promotions.
- Ignores spam-like messages.
- Ignores configurable newsletters.
- Detects action-required language.
- Detects deadlines.
- Classifies priority.

## Prompt Builder

- Separates system and user prompts.
- Includes required email fields.
- Includes structured output instructions.
- Handles empty input.

## Gemini

- Parses valid structured response.
- Rejects invalid response.
- Retries transient failures.
- Handles empty input.

## Formatter

- Groups summaries by priority.
- Includes action and deadline fields when present.
- Handles missing optional fields.
- Produces useful empty digest.

## Dispatcher

- Sends Discord webhook payload.
- Retries transient failures.
- Redacts webhook URL.
- Returns controlled failure result.

## Scheduler

- Invokes orchestrator on tick.
- Skips duplicate active job.
- Releases lock after failure.

## Orchestrator

- Runs happy path.
- Handles no important emails.
- Handles controlled Gmail, Gemini, and Discord failures.
