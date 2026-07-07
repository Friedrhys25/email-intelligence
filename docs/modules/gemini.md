# Gemini

## Purpose

Generate concise, useful email summaries from filtered email data.

## Responsibilities

- Send prompts to Gemini.
- Retry transient provider failures.
- Validate AI responses.
- Return structured summary data.
- Keep provider-specific response handling inside the module.

## Inputs

- System prompt.
- User prompt containing processed email data.
- Gemini API key and model configuration.

## Outputs

- Structured summary records with email ID, priority, sender, subject, summary, action-required status, deadline, and confidence.

## Flow

1. Receive prompt from Prompt Builder.
2. Send request to Gemini.
3. Retry transient errors.
4. Parse and validate response.
5. Return structured summaries to the orchestrator.

## Acceptance Criteria

- Returns structured output, not arbitrary prose.
- Handles empty email input.
- Retries temporary failures.
- Logs provider failures without logging sensitive email body content by default.

## Testing Checklist

- Successful Gemini response is parsed.
- Invalid response fails validation.
- Transient failures retry.
- Permanent failures return a controlled error.
- Empty input returns an empty summary set.
