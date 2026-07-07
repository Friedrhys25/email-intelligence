# Render Deployment

## Service Type

Use a Render web service if the app exposes Express routes and an internal scheduler. Use Render Cron only if the digest is implemented as a one-shot command.

## Build

- Build command: `npm install --include=dev --no-audit --no-fund && npm run build`
- Start command: `npm start`
- Health check path: `/health`
- Root directory: `email-intelligence`
- Node version: `22.x` from `email-intelligence/package.json`

If deploying with the included Render Blueprint, use `render.yaml` from the repository root. It configures the root directory, build command, start command, health check path, and non-secret defaults.

## Environment Variables

- `NODE_ENV=production`
- `PORT`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `GOOGLE_REFRESH_TOKEN`
- `GEMINI_API_KEY`
- `DISCORD_WEBHOOK_URL`
- `EMAIL_FETCH_LIMIT=10`
- `DIGEST_CRON=0 10,21 * * *`
- `SCHEDULER_TIMEZONE=Asia/Manila`
- `SCHEDULER_ENABLED=true`

## Deployment Steps

1. Push the repository to GitHub.
2. Create a Render web service from the repository.
3. Set root directory to `email-intelligence`.
4. Set build command to `npm install --include=dev --no-audit --no-fund && npm run build` and start command to `npm start`.
5. Add all environment variables.
6. Configure `/health` as the health check path.
7. Deploy.
8. Confirm logs show the scheduler started.
9. Wait for the scheduled run.

## Common Issues

- OAuth callback mismatch: `GOOGLE_REDIRECT_URI` must match Google Cloud exactly.
- Missing refresh token: rerun local OAuth setup with consent prompt enabled.
- Discord delivery failure: confirm the webhook URL is active and points to the expected channel.
- Gemini failure: verify API key and quota.
