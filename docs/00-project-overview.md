# Project Overview

## Product

Inbox Intelligence is a personal AI email assistant. It monitors a Gmail inbox, identifies important recent emails, summarizes them with Gemini, and sends a readable Markdown digest to Discord.

## Vision

Build a lightweight executive-assistant workflow where the user reads one AI-generated briefing instead of manually scanning every email.

## Goals

- Connect securely to Gmail with Google OAuth2.
- Fetch the latest unread emails, defaulting to ten messages per run.
- Filter out low-value messages such as promotions, OTPs, newsletters, receipts, and spam.
- Classify priority, action requirements, deadlines, and important contacts.
- Generate concise Gemini summaries.
- Format the output as a Discord-friendly Markdown digest.
- Run automatically on a schedule and deploy to Render.

## Features

- Gmail OAuth2 and refresh-token handling.
- Gmail API integration.
- Email processor with configurable filtering rules.
- Prompt builder with separate system and user prompts.
- Gemini AI integration with retries and response validation.
- Markdown formatter grouped by priority.
- Discord dispatcher with delivery logging.
- Scheduler that prevents duplicate jobs.
- Health endpoint for deployment monitoring.

## Version 1 Scope

In scope: Gmail, Gemini, Discord, scheduling, logging, error handling, Markdown digest generation, Render deployment, and production-ready documentation.

Out of scope: UI dashboard, user accounts, database, multiple users, payments, mobile app, browser extension, and non-Gmail providers.

## Definition of Done

- OAuth2 authentication works.
- Gmail messages are retrieved successfully.
- Important emails are identified.
- Gemini returns useful summaries.
- Discord receives formatted digests.
- Scheduler runs without manual intervention.
- Render deployment is configured.
- Tests pass.
- Code follows Clean Architecture, SOLID principles, and TypeScript standards.
