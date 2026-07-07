# System Architecture

## Overview

Inbox Intelligence is a scheduled backend workflow. It does not need a UI or database in version 1. The app authenticates once with Google OAuth2, stores credentials in environment variables or a protected runtime secret, then uses the refresh token during scheduled runs.

## Components

- Scheduler: starts the workflow on a development or production cadence.
- Orchestrator: coordinates the full run and keeps module boundaries clean.
- Authentication: manages OAuth2 clients, access-token refresh, and Gmail scopes.
- Gmail: fetches and normalizes recent messages.
- Email Processor: filters low-value emails and classifies useful ones.
- Prompt Builder: creates Gemini prompts from normalized email data.
- Gemini: sends prompts, retries transient failures, and validates structured output.
- Formatter: converts summaries into a Discord-friendly Markdown digest.
- Dispatcher: sends the digest to Discord and logs delivery status.
- Health API: exposes runtime status for Render health checks.

## Runtime Flow

```text
Scheduler
  -> Orchestrator
  -> Authentication
  -> Gmail
  -> Email Processor
  -> Prompt Builder
  -> Gemini
  -> Formatter
  -> Discord Dispatcher
```

## Failure Handling

- A single failed email must not crash the full run.
- External API failures should be retried when transient.
- Permanent failures should be logged with enough context to debug without exposing secrets.
- Scheduler failures should be caught so the process remains alive.

## Boundaries

- Gmail module returns EmailDTO objects and hides Google API response details.
- Gemini module returns validated summary data and hides provider response details.
- Formatter receives structured summaries only; it does not call AI or Gmail.
- Dispatcher receives final Markdown only; it does not know how summaries are created.
