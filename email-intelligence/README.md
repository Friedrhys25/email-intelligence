# Inbox Intelligence

Inbox Intelligence is an AI-powered Gmail digest service. It will fetch recent Gmail messages, filter low-value emails, summarize important messages with Gemini, and send a Markdown digest to Discord.

## Phase 1

This phase contains the backend foundation:

- Node.js, Express, and TypeScript
- Environment validation with Zod
- Pino logging
- Health route
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

## Environment

Copy `.env.example` to `.env` for local development. Phase 1 only requires `NODE_ENV`, `PORT`, and `LOG_LEVEL`; later phases will require Gmail, Gemini, Discord, and scheduler secrets.
