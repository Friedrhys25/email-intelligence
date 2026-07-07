# Gemini API

## Purpose

Configure Gemini for AI-generated email summaries.

## Prerequisites

- Gemini API key.
- Prompt builder implemented.
- Summary schema defined.

## Step-by-step

1. Create or obtain a Gemini API key.
2. Add `GEMINI_API_KEY` to environment variables.
3. Configure the Gemini client.
4. Send system and user prompts from the Prompt Builder.
5. Request structured output.
6. Validate output before formatting.

## Common Errors

- Invalid API key: verify the key and environment variable name.
- Quota exceeded: retry when appropriate and log provider status.
- Unstructured model output: strengthen schema instructions and validate responses.
- Oversized prompt: trim email body content before sending.

## Checklist

- API key is stored outside git.
- Gemini service can summarize a mocked prompt.
- Invalid responses fail validation.
- Retries are implemented for transient failures.
