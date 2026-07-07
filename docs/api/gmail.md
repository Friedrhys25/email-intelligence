# API - Gmail

## Endpoints

- `GET /gmail/latest`
  - Development/debug endpoint for fetching normalized recent emails.
  - Production scheduled runs should use the orchestrator instead of this endpoint.
- `POST /gmail/digest/run`
  - Optional protected endpoint for manually triggering a digest run.

## Request

- `GET /gmail/latest?limit=5`
  - `limit` is optional and defaults to `5`.
- `POST /gmail/digest/run`
  - No body required for version 1.
  - Protect this endpoint before exposing it publicly.

## Response

Example `GET /gmail/latest` response:

```json
{
  "count": 1,
  "emails": [
    {
      "id": "message-id",
      "sender": "GitHub <noreply@github.com>",
      "subject": "Security alert",
      "date": "2026-07-04T07:00:00.000Z",
      "snippet": "A dependency vulnerability was detected",
      "body": "..."
    }
  ]
}
```

Example digest run response:

```json
{
  "status": "completed",
  "fetched": 5,
  "included": 2,
  "dispatched": true
}
```

## Errors

- `401` when Gmail credentials are missing or expired and cannot be refreshed.
- `429` when Gmail rate limits the app.
- `500` when message fetch or normalization fails unexpectedly.
