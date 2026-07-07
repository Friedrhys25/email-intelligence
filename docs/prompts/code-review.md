# Code Review Prompt

## Context

Use this prompt before merging any Inbox Intelligence implementation work.

## Goal

Review code for correctness, security, maintainability, and PRD alignment.

## Requirements

- Check OAuth2 least-privilege access.
- Check secret handling.
- Check Gmail, Gemini, and Discord error handling.
- Check scheduler duplicate-run protection.
- Check DTO boundaries.
- Check tests for changed behavior.
- Check no out-of-scope features were added.

## Deliverables

- Findings ordered by severity.
- File and line references.
- Missing test coverage.
- Clear fix recommendations.

## Acceptance Criteria

- Security issues are called out first.
- Behavioral regressions are clearly explained.
- Documentation drift from the PRD is identified.
- Non-actionable style comments are avoided.

### Prompt Template

```text
Using the System Prompt and PRD, review this Inbox Intelligence change. Prioritize bugs, security risks, behavioral regressions, missing tests, module boundary violations, and documentation drift.
```
