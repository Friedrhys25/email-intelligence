# Render

## Purpose

Deploy Inbox Intelligence so the digest can run automatically without a local machine.

## Prerequisites

- GitHub repository.
- Render account.
- Build and start scripts.
- `/health` endpoint.
- Production environment variables.
- `render.yaml` in the repository root, if using Render Blueprint deployment.

## Step-by-step

1. Push code to GitHub.
2. Create a new Render web service from the repo.
3. Set root directory to `email-intelligence`.
4. Set build command to `npm install --include=dev --no-audit --no-fund && npm run build`.
5. Set start command to `npm start`.
6. Add environment variables, including `SCHEDULER_ENABLED=true`.
7. Configure health check path as `/health`.
8. Deploy.
9. Check logs for startup and scheduler registration.
10. Verify Discord receives a digest after the next scheduled run.

## Common Errors

- Missing env vars: Render deploy starts but app exits during config validation.
- Wrong port: Express must listen on `process.env.PORT`.
- OAuth callback mismatch: add the Render callback URL in Google Cloud.
- Scheduler not running: confirm `DIGEST_CRON` is set and scheduler is enabled.

## Checklist

- Build succeeds.
- App starts.
- `/health` returns `200`.
- Scheduler starts.
- Manual or scheduled digest reaches Discord.
