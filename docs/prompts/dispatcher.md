# Dispatcher Prompt

## Context

Inbox Intelligence delivers the final digest through Discord.

## Goal

Implement the Dispatcher module.

## Requirements

- Send Markdown to a Discord webhook.
- Retry transient failures.
- Redact webhook URL in logs.
- Return delivery status.
- Handle empty digest content safely.

## Deliverables

- Discord dispatcher service.
- Delivery result type.
- Tests with mocked HTTP calls.

## Acceptance Criteria

- Successful delivery is logged.
- Failed delivery is returned as a controlled result.
- Webhook secret is never exposed.
- Scheduler does not crash on delivery failure.

### Prompt Template

```text
Using the System Prompt, implement the Discord Dispatcher module for Inbox Intelligence. Send Markdown via webhook, retry transient failures, redact secrets, return delivery status, and include tests.
```
