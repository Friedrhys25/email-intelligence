# Scheduler Prompt

## Context

Inbox Intelligence must run automatically without manual intervention.

## Goal

Implement the Scheduler module.

## Requirements

- Read cron expression from configuration.
- Trigger the orchestrator.
- Prevent overlapping runs.
- Log scheduler lifecycle events.
- Keep process alive after controlled errors.

## Deliverables

- Scheduler service.
- Scheduler config validation.
- Unit tests.

## Acceptance Criteria

- Scheduled tick invokes orchestrator.
- Duplicate active run is skipped.
- Lock is released after success or failure.
- Invalid cron config fails startup clearly.

### Prompt Template

```text
Using the System Prompt, implement the Scheduler module for Inbox Intelligence. Run the orchestrator on a configurable cron schedule, prevent duplicates, log results, recover from controlled failures, and include tests.
```
