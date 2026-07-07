# Dispatcher

## Purpose

Deliver the final Markdown digest to Discord.

## Responsibilities

- Send Markdown content to the configured Discord webhook.
- Respect Discord message limits.
- Retry transient delivery failures.
- Log delivery status.
- Return a delivery result to the orchestrator.

## Inputs

- Discord webhook URL.
- Markdown digest string.
- Run correlation ID.

## Outputs

- Delivery result with success status, timestamp, and provider response metadata.

## Flow

1. Receive formatted Markdown from the formatter.
2. Validate that content is not empty.
3. Send payload to Discord webhook.
4. Retry transient failures.
5. Log success or failure.

## Acceptance Criteria

- Sends digest to the expected Discord channel.
- Does not expose the webhook URL in logs.
- Reports failure without crashing the scheduler.
- Handles empty digests with a clear no-op or "no important emails" message.

## Testing Checklist

- Successful webhook request.
- Retry on transient failure.
- Permanent failure returns a failed delivery result.
- Long content behavior is tested.
