# Orchestrator Prompt

## Context

Inbox Intelligence is a scheduled pipeline that coordinates Gmail, processing, Gemini, formatting, and Discord.

## Goal

Implement the Orchestrator module.

## Requirements

- Fetch recent Gmail messages.
- Process and filter messages.
- Build Gemini prompts.
- Generate summaries.
- Format Markdown.
- Dispatch to Discord.
- Return run metadata and errors.

## Deliverables

- Inbox orchestrator service.
- DigestRunResult type.
- Unit tests with mocked module services.

## Acceptance Criteria

- Happy path completes.
- No-important-email path completes.
- Controlled module failures are handled.
- Run counts and status are accurate.

### Prompt Template

```text
Using the System Prompt, implement the Orchestrator module for Inbox Intelligence. Coordinate the full digest workflow, keep module boundaries clean, return run metadata, handle controlled failures, and include tests.
```
