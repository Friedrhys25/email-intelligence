# Prompt Builder

## Purpose

Build reusable Gemini prompts from processed email data.

## Responsibilities

- Separate system prompt from user prompt.
- Preserve structured email metadata.
- Ask Gemini for concise summaries and structured output.
- Keep prompt templates versionable and testable.

## Inputs

- ProcessedEmail objects.
- Prompt configuration.
- Output schema expectations.

## Outputs

- System prompt string.
- User prompt string.
- Expected response schema description.

## Flow

1. Receive filtered and prioritized emails.
2. Remove unnecessary body content.
3. Build a system prompt that defines the assistant role and rules.
4. Build a user prompt containing structured email data.
5. Request JSON-compatible structured output.

## Acceptance Criteria

- Prompt includes sender, subject, date, snippet/body excerpt, priority, and inclusion reason.
- Prompt tells Gemini to ignore low-value content if it slips through.
- Prompt asks for action-required and deadline detection.
- Prompt avoids exposing secrets.

## Testing Checklist

- Empty input prompt is handled.
- Multiple emails are formatted consistently.
- System and user prompts are separate.
- Schema instructions are present.
