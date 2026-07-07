# API - Health

## Endpoints

- `GET /health`
  - Used by Render and local checks to confirm the service is alive.

## Request

- No request body.
- No authentication required.

## Response

```json
{
  "status": "ok",
  "service": "inbox-intelligence",
  "version": "1.0"
}
```

Optional fields:

- `uptimeSeconds`
- `lastDigestRunAt`
- `lastDigestStatus`

## Errors

- Health should return `200` when the process is alive.
- Dependency health checks may be exposed separately later; do not block `/health` on Gmail, Gemini, or Discord availability in version 1.
