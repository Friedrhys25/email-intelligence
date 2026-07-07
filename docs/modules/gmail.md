# Gmail

## Purpose

Fetch recent Gmail messages and normalize them for processing.

## Responsibilities

- Use authenticated Google credentials.
- Fetch the latest messages, defaulting to five.
- Support configurable limits.
- Read sender, subject, date, snippet, and body when required.
- Normalize provider responses into EmailDTO objects.
- Continue when a single message cannot be fetched.

## Inputs

- Authorized Gmail client.
- Fetch limit.
- Optional query filters.

## Outputs

- Array of EmailDTO objects:
  - id
  - threadId
  - sender
  - subject
  - date
  - snippet
  - body
  - labels

## Flow

1. Request recent Gmail message IDs.
2. Fetch message details.
3. Decode headers and body.
4. Normalize into EmailDTO.
5. Return successful messages with failure logs for skipped messages.

## Acceptance Criteria

- Defaults to latest five emails.
- Supports a configurable limit.
- Handles missing headers.
- Does not leak Gmail credentials.
- Produces stable DTOs for downstream modules.

## Testing Checklist

- Maps Gmail headers to EmailDTO fields.
- Decodes plain text body.
- Falls back to snippet when body is unavailable.
- Continues after one message fetch fails.
- Handles empty inbox result.
