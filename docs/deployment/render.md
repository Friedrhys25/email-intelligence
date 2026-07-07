# Render Deployment

## Service Type

Use a Render web service if the app exposes Express routes and an internal scheduler. Use Render Cron only if the digest is implemented as a one-shot command.

## Build

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Health check path: `/health`

## Environment Variables

- `NODE_ENV=production`
- `PORT`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `GOOGLE_REFRESH_TOKEN`
- `GEMINI_API_KEY`
- `DISCORD_WEBHOOK_URL`
- `EMAIL_FETCH_LIMIT=5`
- `DIGEST_CRON`

## Deployment Steps

1. Push the repository to GitHub.
2. Create a Render web service from the repository.
3. Set build and start commands.
4. Add all environment variables.
5. Configure `/health` as the health check path.
6. Deploy.
7. Confirm logs show the scheduler started.
8. Run a manual digest or wait for the scheduled run.

## Common Issues

- OAuth callback mismatch: `GOOGLE_REDIRECT_URI` must match Google Cloud exactly.
- Missing refresh token: rerun local OAuth setup with consent prompt enabled.
- Discord delivery failure: confirm the webhook URL is active and points to the expected channel.
- Gemini failure: verify API key and quota.
