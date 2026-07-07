# Inbox Intelligence

Inbox Intelligence is an AI email digest automation. It checks unread Gmail messages, filters out low-value emails, summarizes important messages with Gemini, and sends a digest to Discord.

## What It Is For

The automation is built for people who want a quick summary of important Gmail messages without manually checking their inbox. It is especially useful for job application updates, interview schedules, rejection notices, deadlines, security alerts, and other action-required emails.

## How The Automation Works

1. A scheduler runs the workflow at 10:00 AM and 9:00 PM Philippine time.
2. The app refreshes Google OAuth credentials using the stored refresh token.
3. Gmail is queried for up to 10 unread inbox messages.
4. Low-value messages such as spam, promotions, OTPs, receipts, and newsletters are filtered out.
5. Important messages are sent to Gemini for structured summarization.
6. The digest is formatted with sender, title, reason, summary, action status, deadline, and confidence.
7. The formatted digest is sent to Discord through a webhook.

## Manual Run

Production can also trigger a digest immediately through a protected endpoint:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "https://email-intelligence.onrender.com/digest/run" `
  -Headers @{ Authorization = 'Bearer YOUR_MANUAL_RUN_TOKEN' }
```

The token must match the `MANUAL_RUN_TOKEN` environment variable configured in Render.

## Main Components

- Google OAuth: connects Gmail with read-only access.
- Gmail integration: fetches unread emails.
- Email processor: filters and prioritizes messages.
- Gemini integration: creates structured summaries.
- Discord dispatcher: sends the digest to Discord.
- Scheduler: runs automatically twice per day.
- Manual endpoint: runs the automation on demand.

## Deployment

The app is deployed to Render as a Node.js web service. Render uses `render.yaml` at the repository root and runs the app from the `email-intelligence` folder.

Required production environment variables include:

```env
NODE_ENV=production
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
GOOGLE_REFRESH_TOKEN=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-flash-latest
DISCORD_WEBHOOK_URL=
MANUAL_RUN_TOKEN=
EMAIL_FETCH_LIMIT=10
DIGEST_CRON=0 10,21 * * *
SCHEDULER_TIMEZONE=Asia/Manila
SCHEDULER_ENABLED=true
```
