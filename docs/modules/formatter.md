# Formatter

## Purpose

Convert validated AI summaries into a readable Markdown digest for Discord.

## Responsibilities

- Group messages by priority.
- Include sender, subject, summary, action required, and deadline when available.
- Produce Discord-friendly Markdown.
- Handle empty digest states.

## Inputs

- Structured summary output from Gemini.
- Processed email metadata.

## Outputs

- Markdown digest string.

## Flow

1. Receive structured summaries.
2. Sort by priority and urgency.
3. Render high, medium, and low priority sections.
4. Add action/deadline lines only when present.
5. Return Markdown to the dispatcher.

## Digest Shape

```markdown
# Inbox Intelligence

## High Priority

### GitHub - Security alert
Summary: A dependency vulnerability needs attention.
Action Required: Review and patch the dependency.
Deadline: Not specified

---
```

## Acceptance Criteria

- Output is readable in Discord.
- Empty states are useful.
- Markdown does not include raw secrets or debug data.
- Priority sections remain consistent.

## Testing Checklist

- Formats high, medium, and low priority sections.
- Handles no included emails.
- Handles missing deadline/action fields.
- Keeps output under Discord limits or exposes splitting behavior.
