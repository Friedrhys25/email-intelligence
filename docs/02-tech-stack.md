# Tech Stack

| Layer | Technology |
| --- | --- |
| Runtime | Node.js |
| Language | TypeScript |
| HTTP API | Express |
| Email | Gmail API |
| Auth | Google OAuth2 |
| AI | Gemini API |
| Notifications | Discord webhook |
| Scheduler | node-cron locally, Render Cron or Render scheduled service in production |
| Validation | Zod |
| Logging | Pino |
| Testing | Unit and integration tests with external API mocks |
| Deployment | Render |

## Standards

- TypeScript throughout.
- Clean Architecture with feature-based modules.
- Dependency injection at module boundaries.
- No hard-coded secrets.
- Structured logging.
- Retries for transient API failures.
- Explicit DTOs for external service boundaries.
