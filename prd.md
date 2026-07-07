# Product Requirements Document (PRD)

# Inbox Intelligence

**Version:** 1.0
**Status:** Draft
**Author:** Rhys Jonathan Abalon

---

# 1. Executive Summary

Inbox Intelligence is an AI-powered email assistant that automatically monitors a user's Gmail inbox, identifies the most important recent emails, generates concise AI summaries, and delivers them as a readable digest through Discord.

The application aims to reduce email overload by filtering out low-value emails (promotions, OTPs, newsletters, spam) and highlighting messages that require attention.

The project is intended to be:

* 100% free to use
* Portfolio-quality
* Production-ready
* Built with modern backend architecture
* Easily extendable into a SaaS product

---

# 2. Problem Statement

Most users receive dozens or even hundreds of emails every day.

Important emails are often buried beneath:

* Promotions
* Marketing emails
* OTP messages
* Receipts
* Newsletters
* Spam

Reading every email manually wastes time.

Users need a lightweight AI assistant that automatically identifies important emails and summarizes them into a digest.

---

# 3. Vision

Build a personal AI email assistant that acts like a smart executive assistant.

Instead of reading every email, the user only reads one AI-generated briefing.

---

# 4. Goals

## Primary Goals

* Connect securely to Gmail
* Fetch the latest emails
* Filter low-value emails
* Summarize important emails using AI
* Deliver summaries automatically
* Deploy the application to Render

## Secondary Goals

* Clean Architecture
* Modular codebase
* Production-ready documentation
* AI-first development workflow
* Excellent GitHub portfolio project

---

# 5. Success Criteria

The project is successful if it can:

* Authenticate with Google OAuth2
* Retrieve Gmail messages
* Process the latest emails
* Ignore unimportant emails
* Generate useful summaries
* Deliver summaries automatically
* Run on a schedule without manual intervention

---

# 6. Target Users

### Primary User

The developer (personal productivity)

### Future Users

* Students
* Software engineers
* Freelancers
* Small business owners
* Professionals with busy inboxes

---

# 7. Scope

## In Scope

* Gmail OAuth2
* Gmail API
* Gemini AI
* Discord Notifications
* Render Deployment
* Scheduler
* Logging
* Error Handling
* Markdown Digest

## Out of Scope (Version 1)

* UI Dashboard
* User Accounts
* Database
* Multiple Users
* Payment System
* Mobile App
* Browser Extension

---

# 8. User Flow

```text
User
│
▼
Authenticate with Google
│
▼
Grant Gmail Permission
│
▼
Refresh Token Saved
│
▼
Scheduler Runs
│
▼
Fetch Latest Emails
│
▼
Filter Emails
│
▼
Build AI Prompt
│
▼
Gemini Generates Summary
│
▼
Format Markdown
│
▼
Send to Discord
```

---

# 9. Functional Requirements

## Authentication

The system shall:

* Authenticate users using Google OAuth2
* Request Gmail read permissions
* Store refresh tokens securely
* Automatically refresh expired access tokens

---

## Gmail Module

The system shall:

* Fetch the latest five emails
* Support configurable limits
* Read:

  * Sender
  * Subject
  * Date
  * Snippet
  * Body (when required)
* Normalize responses into EmailDTO objects

---

## Email Processing

The system shall:

* Ignore spam
* Ignore promotions
* Ignore OTPs
* Ignore newsletters (configurable)
* Classify email priority
* Detect action-required emails
* Detect deadlines
* Detect important contacts

---

## Prompt Builder

The system shall:

* Build reusable prompts
* Separate system prompt from user prompt
* Support future prompt templates

---

## AI Module

The system shall:

* Send prompts to Gemini
* Retry transient failures
* Validate AI responses
* Return structured output

---

## Formatter

The system shall:

Generate a Markdown digest similar to:

```markdown
# Inbox Intelligence

## High Priority

### GitHub

Summary

Action Required

---

## Medium Priority

...

---

## Low Priority

...
```

---

## Dispatcher

The system shall:

* Send Markdown to Discord
* Retry failed deliveries
* Log delivery status

---

## Scheduler

The system shall:

* Execute automatically
* Prevent duplicate jobs
* Support development and production schedules

---

# 10. Non-Functional Requirements

## Performance

* Complete a run in under 30 seconds
* Support API retries
* Handle temporary failures gracefully

## Reliability

* Continue processing when a single email fails
* Log all failures
* Never crash the scheduler

## Security

* Use OAuth2
* Never expose secrets
* Store credentials in environment variables
* Follow least-privilege access

## Maintainability

* Clean Architecture
* SOLID principles
* Dependency Injection
* Feature-based modules
* TypeScript throughout

---

# 11. System Architecture

```text
Scheduler
      │
      ▼
OAuth Manager
      │
      ▼
Gmail Service
      │
      ▼
Email Processor
      │
      ▼
Prompt Builder
      │
      ▼
Gemini Service
      │
      ▼
Formatter
      │
      ▼
Discord Dispatcher
```

---

# 12. Module Responsibilities

| Module          | Responsibility               |
| --------------- | ---------------------------- |
| Authentication  | Google OAuth2 authentication |
| Gmail           | Fetch emails                 |
| Email Processor | Filter and prioritize emails |
| Prompt Builder  | Generate AI prompts          |
| Gemini          | AI communication             |
| Formatter       | Markdown generation          |
| Dispatcher      | Send notifications           |
| Scheduler       | Execute automation           |
| Orchestrator    | Coordinate the workflow      |

---

# 13. Development Phases

## Phase 1

Project setup

## Phase 2

Google Cloud configuration

## Phase 3

OAuth2 implementation

## Phase 4

Gmail integration

## Phase 5

Email processing

## Phase 6

Prompt builder

## Phase 7

Gemini integration

## Phase 8

Markdown formatter

## Phase 9

Discord dispatcher

## Phase 10

Scheduler

## Phase 11

Deployment

## Phase 12

Testing

---

# 14. Future Enhancements

* Multi-user support
* Web dashboard
* AI-generated task extraction
* Calendar integration
* GitHub notifications
* Daily productivity briefing
* Slack integration
* Telegram integration
* Mobile push notifications
* Weekly and monthly email reports
* AI-powered email categorization learning
* Support for multiple email providers (Outlook, Yahoo, IMAP)

---

# 15. Definition of Done

The project is considered complete when:

* Google OAuth2 authentication works.
* Gmail API retrieves emails successfully.
* Important emails are identified.
* Gemini generates accurate summaries.
* Discord receives formatted digests.
* The scheduler runs automatically.
* The application is deployed successfully on Render.
* Documentation is complete.
* Tests pass successfully.
* The codebase follows Clean Architecture and SOLID principles.

---

# 16. Long-Term Vision

Inbox Intelligence should evolve from a simple email summarizer into a personal AI productivity assistant capable of combining information from Gmail, GitHub, Calendar, task managers, and other services to produce a single daily briefing that helps users prioritize their work and stay informed.
