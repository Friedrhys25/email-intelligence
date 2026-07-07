# Discord

## Purpose

Configure Discord as the delivery channel for Inbox Intelligence digests.

## Prerequisites

- Discord server and channel.
- Permission to create a webhook.
- Final digest Markdown from the formatter.

## Step-by-step

1. Open the target Discord channel settings.
2. Create an incoming webhook.
3. Copy the webhook URL.
4. Store it as `DISCORD_WEBHOOK_URL`.
5. Send a test message.
6. Confirm the channel receives the digest.

## Common Errors

- Invalid webhook URL: recreate the webhook and update the env var.
- Message too long: split digest or reduce summary length.
- Wrong channel: confirm webhook destination.
- Secret leak: never log the full webhook URL.

## Checklist

- Webhook exists.
- Webhook URL is stored outside git.
- Test delivery works.
- Dispatcher redacts webhook URL in logs.
