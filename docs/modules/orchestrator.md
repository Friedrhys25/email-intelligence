# Orchestrator

## Purpose

Coordinate the full Inbox Intelligence digest workflow.

## Responsibilities

- Start a digest run.
- Request recent emails from Gmail.
- Process and filter emails.
- Build Gemini prompts.
- Request AI summaries.
- Format Markdown.
- Dispatch to Discord.
- Track run status and duration.

## Inputs

- Runtime config.
- Module service dependencies.
- Optional manual run parameters.

## Outputs

- DigestRunResult with status, fetched count, included count, dispatch status, timestamps, and errors.

## Flow

1. Create run correlation ID.
2. Fetch latest Gmail messages.
3. Process and filter messages.
4. If no important messages remain, format an empty-state digest.
5. Build prompt for included emails.
6. Generate Gemini summaries.
7. Format Markdown digest.
8. Send digest to Discord.
9. Return run result.

## Acceptance Criteria

- Coordinates modules without taking over their internal responsibilities.
- Does not crash when one module returns a controlled failure.
- Logs enough run metadata to debug production issues.
- Prevents duplicate run execution when called by scheduler.

## Testing Checklist

- Happy path run.
- No important emails path.
- Gmail partial failure path.
- Gemini failure path.
- Discord failure path.
- Duplicate run prevention.
