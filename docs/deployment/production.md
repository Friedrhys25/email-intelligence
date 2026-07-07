# Production Checklist

## Required Configuration

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

## Security

- Store all secrets as Render environment variables.
- Never commit OAuth credentials, refresh tokens, API keys, or webhook URLs.
- Use Gmail read-only scope.
- Do not log email bodies unless explicitly enabled for local debugging.

## Reliability

- Scheduler catches and logs failures.
- External API calls use retries for transient failures.
- One failed email does not stop the digest run.
- Duplicate scheduler executions are blocked with an in-memory job lock for version 1.

## Observability

- Use structured Pino logs.
- Log run start, fetched count, filtered count, included count, Gemini status, Discord status, and run duration.
- Include correlation IDs per digest run.

## Release Checklist

- Build passes.
- Unit tests pass.
- Integration tests pass or are intentionally skipped with documented mocks.
- `/health` returns `200`.
- Manual digest run succeeds.
- Discord receives the expected Markdown digest.
