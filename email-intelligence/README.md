# Inbox Intelligence

Inbox Intelligence is an AI-powered Gmail digest service. It will fetch recent Gmail messages, filter low-value emails, summarize important messages with Gemini, and send a Markdown digest to Discord.

## Current Scope

This service contains the backend foundation and scheduled digest workflow:

- Node.js, Express, and TypeScript
- Environment validation with Zod
- Pino logging
- Health route
- Google OAuth and Gmail read-only fetching
- Gemini summarization
- Discord digest delivery
- Internal scheduler
- Test, build, lint, and format scripts
- Clean Architecture folder structure for later modules

## Scripts

```bash
npm run dev
npm run build
npm run test
npm run lint
npm run format:check
```

Use Node.js 22 LTS locally and in production. Render reads this from `package.json`.

## Environment

Copy `.env.example` to `.env` for local development.

For local scheduled runs, set:

```env
SCHEDULER_ENABLED=true
DIGEST_CRON=0 10,21 * * *
SCHEDULER_TIMEZONE=Asia/Manila
```

Keep `SCHEDULER_ENABLED=false` when you only want to test routes manually.

## Deployment

The repository root includes `render.yaml` for Render Blueprint deployment. It points Render to the `email-intelligence` subfolder, runs `npm ci && npm run build`, starts with `npm start`, and uses `/health` as the health check path.

Production requires these Render environment variables:

```env
NODE_ENV=production
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
GOOGLE_REFRESH_TOKEN=
GEMINI_API_KEY=
DISCORD_WEBHOOK_URL=
EMAIL_FETCH_LIMIT=10
DIGEST_CRON=0 10,21 * * *
SCHEDULER_TIMEZONE=Asia/Manila
SCHEDULER_ENABLED=true
```
