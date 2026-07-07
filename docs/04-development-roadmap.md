# Roadmap

## Phase 1: Project Setup

- Initialize Node.js, TypeScript, Express, linting, formatting, testing, logging, and env validation.

## Phase 2: Google Cloud Configuration

- Create Google Cloud project.
- Configure OAuth consent screen.
- Enable Gmail API.
- Create OAuth2 credentials.

## Phase 3: Authentication

- Implement Google OAuth2 start and callback routes.
- Request Gmail read-only scope.
- Persist refresh-token configuration securely.
- Refresh access tokens automatically.

## Phase 4: Gmail Integration

- Fetch the latest ten unread messages by default.
- Support configurable fetch limits.
- Normalize sender, subject, date, snippet, and body into EmailDTO objects.

## Phase 5: Email Processing

- Filter spam, promotions, OTPs, receipts, and newsletters.
- Detect action-required messages, deadlines, and important contacts.
- Classify priority.

## Phase 6: Prompt Builder

- Separate system prompt from user prompt.
- Build reusable prompt templates.
- Keep email content structured and concise.

## Phase 7: Gemini Integration

- Send prompts to Gemini.
- Retry transient failures.
- Validate structured AI output.

## Phase 8: Formatter

- Generate Markdown grouped by high, medium, and low priority.
- Include summary, action required, deadline, and source email metadata when available.

## Phase 9: Discord Dispatcher

- Send Markdown digest to Discord.
- Retry failed delivery.
- Log status.

## Phase 10: Scheduler

- Run automatically.
- Prevent duplicate jobs.
- Support local and production schedules.

## Phase 11: Deployment

- Deploy to Render.
- Configure secrets, build command, start command, health check, and scheduler.

## Phase 12: Testing

- Add unit tests for modules.
- Add integration tests for OAuth, Gmail, Gemini, Discord, scheduler, and orchestrator workflows.
