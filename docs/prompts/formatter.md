# Formatter Prompt

## Context

Inbox Intelligence sends a Markdown digest to Discord.

## Goal

Implement the Formatter module.

## Requirements

- Group summaries by high, medium, and low priority.
- Include sender, subject, summary, action required, and deadline.
- Format Discord-friendly Markdown.
- Support a useful empty digest state.

## Deliverables

- Digest formatter service.
- Formatter tests.

## Acceptance Criteria

- Output is readable in Discord.
- Missing optional fields do not create broken Markdown.
- Empty digest output is useful.
- Output does not include secrets or debug-only data.

### Prompt Template

```text
Using the System Prompt, implement the Formatter module for Inbox Intelligence. Convert validated summary data into a Discord-friendly Markdown digest grouped by priority, including empty-state handling and tests.
```
