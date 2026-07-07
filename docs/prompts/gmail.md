# Gmail Prompt

## Context

Inbox Intelligence fetches recent Gmail messages after OAuth2 authentication.

## Goal

Implement the Gmail module.

## Requirements

- Fetch latest messages, default limit `5`.
- Support configurable limits.
- Read sender, subject, date, snippet, body when available, labels, id, and threadId.
- Normalize Gmail API responses into EmailDTO.
- Continue when one message fails.
- Avoid logging sensitive message bodies by default.

## Deliverables

- Gmail service.
- Gmail mapper.
- EmailDTO type.
- Unit tests for mapping and failure handling.

## Acceptance Criteria

- Fetches recent messages through an authenticated Gmail client.
- Produces stable EmailDTO objects.
- Handles empty inboxes and missing headers.
- Does not expose credentials.

### Prompt Template

```text
Using the System Prompt, implement the Gmail module for Inbox Intelligence. Fetch the latest Gmail messages, normalize provider responses into EmailDTO objects, handle partial failures, keep logging safe, and include tests.
```
