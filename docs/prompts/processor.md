# Processor Prompt

## Context

Inbox Intelligence must remove low-value emails before sending content to Gemini.

## Goal

Implement the Email Processor module.

## Requirements

- Ignore spam, promotions, OTPs, receipts, and configurable newsletters.
- Detect action-required language.
- Detect deadlines.
- Detect important contacts.
- Assign high, medium, or low priority.
- Return structured ProcessedEmail objects.

## Deliverables

- Email processor service.
- Rule helpers.
- Priority types.
- Unit tests with representative email examples.

## Acceptance Criteria

- Filtering is deterministic.
- Priority classification is explainable.
- Malformed email records do not crash the batch.
- Rules can evolve without changing Gmail or Gemini modules.

### Prompt Template

```text
Using the System Prompt, implement the Email Processor module for Inbox Intelligence. Filter low-value email, detect actions and deadlines, classify priority, return structured results, and include tests for each rule category.
```
