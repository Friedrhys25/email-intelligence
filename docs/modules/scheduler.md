# Scheduler

## Purpose

Run the digest workflow automatically without manual intervention.

## Responsibilities

- Start scheduled jobs.
- Support different local and production schedules.
- Prevent overlapping runs.
- Log scheduler start, success, and failure.
- Keep the process alive after controlled failures.

## Inputs

- Cron expression.
- Orchestrator dependency.
- Runtime environment.

## Outputs

- Scheduled digest run attempts.
- Scheduler status logs.

## Flow

1. Read `DIGEST_CRON`.
2. Register scheduled job.
3. On tick, check whether a run is already active.
4. Execute orchestrator.
5. Log result.
6. Release job lock.

## Acceptance Criteria

- Runs automatically.
- Blocks duplicate jobs.
- Does not crash process on orchestrator failure.
- Can be disabled or adjusted for development.

## Testing Checklist

- Job executes orchestrator.
- Duplicate active job is skipped.
- Failure is logged and lock is released.
- Invalid cron config fails startup clearly.
