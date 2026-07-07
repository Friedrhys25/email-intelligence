# Prompt Builder Prompt

## Context

Inbox Intelligence sends only processed important emails to Gemini.

## Goal

Implement the Prompt Builder module.

## Requirements

- Keep system and user prompts separate.
- Include structured email metadata.
- Ask for concise summaries.
- Ask for action-required and deadline extraction.
- Request structured JSON-compatible output.

## Deliverables

- Prompt builder service.
- Prompt templates.
- Tests that verify required instructions are present.

## Acceptance Criteria

- Empty email list is handled.
- Prompt output is deterministic for the same input.
- Prompt includes schema expectations.
- Secrets are not included.

### Prompt Template

```text
Using the System Prompt, implement the Prompt Builder module for Inbox Intelligence. Build reusable system and user prompts from processed emails, request structured Gemini output, and include tests.
```
