# Gemini Prompt

## Context

Inbox Intelligence uses Gemini to summarize important emails.

## Goal

Implement the Gemini module.

## Requirements

- Send system and user prompts to Gemini.
- Retry transient failures.
- Validate structured output.
- Return summary records with priority, summary, action required, deadline, and confidence.
- Handle empty input.

## Deliverables

- Gemini service.
- Gemini client wrapper.
- Summary schema.
- Unit tests with mocked provider responses.

## Acceptance Criteria

- Valid AI output is parsed.
- Invalid AI output fails validation.
- Transient errors are retried.
- Provider secrets are redacted.

### Prompt Template

```text
Using the System Prompt, implement the Gemini module for Inbox Intelligence. Send prompts, retry transient failures, validate structured output with Zod, return typed summaries, and include tests.
```
