# Email Processor

## Purpose

Convert normalized emails into a filtered, prioritized set of messages worth summarizing.

## Responsibilities

- Ignore low-value email categories.
- Detect action-required messages.
- Detect deadlines.
- Identify important contacts.
- Classify priority as high, medium, or low.
- Preserve enough metadata for Gemini and the formatter.

## Inputs

- Array of EmailDTO objects from the Gmail module.
- Configurable rules for newsletter filtering and important contacts.

## Outputs

- ProcessedEmail objects with priority, category, action-required status, deadline, inclusion reason, and normalized metadata.

## Flow

1. Receive EmailDTO objects.
2. Remove spam, promotions, OTPs, receipts, and configurable newsletters.
3. Score remaining emails based on sender, subject, snippet, body, deadlines, and action language.
4. Assign priority.
5. Return only emails that should appear in the digest.

## Acceptance Criteria

- Default run can process the latest five emails.
- Filtering is deterministic and testable.
- Rules can be adjusted without changing Gmail or Gemini modules.
- A malformed email does not stop the full batch.

## Testing Checklist

- OTPs are ignored.
- Promotions are ignored.
- Newsletters can be ignored when configured.
- Action-required language is detected.
- Deadlines are detected.
- Priority classification is stable for representative examples.
