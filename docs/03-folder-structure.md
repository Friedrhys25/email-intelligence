# Folder Structure

Recommended version 1 structure:

```text
src/
  app.ts
  server.ts
  config/
    env.ts
  shared/
    logger.ts
    errors.ts
    retry.ts
  modules/
    authentication/
      auth.controller.ts
      auth.service.ts
      google-oauth.client.ts
      auth.types.ts
    gmail/
      gmail.service.ts
      gmail.mapper.ts
      email.dto.ts
    email-processor/
      email-processor.service.ts
      email-rules.ts
      priority.types.ts
    prompt-builder/
      prompt-builder.service.ts
      prompts.ts
    gemini/
      gemini.service.ts
      gemini.client.ts
      summary.schema.ts
    formatter/
      digest-formatter.service.ts
    dispatcher/
      discord-dispatcher.service.ts
    scheduler/
      scheduler.service.ts
    orchestrator/
      inbox-orchestrator.service.ts
  routes/
    health.routes.ts
    auth.routes.ts
    gmail.routes.ts
tests/
  unit/
  integration/
```

## Rules

- `modules/*` owns feature logic and service contracts.
- `shared/*` contains cross-cutting helpers only.
- `config/env.ts` validates environment variables before the app starts.
- Controllers parse HTTP input and call services; they must not contain Gmail, Gemini, or Discord business logic.
- External API response shapes are mapped into internal DTOs before leaving a module.
