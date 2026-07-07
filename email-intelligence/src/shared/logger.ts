import pino from "pino";
import { env } from "../config/env.js";

export const redactionPaths = [
  "req.headers.authorization",
  "req.headers.cookie",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REFRESH_TOKEN",
  "GEMINI_API_KEY",
  "DISCORD_WEBHOOK_URL"
];

export const logger = pino({
  level: env.LOG_LEVEL,
  redact: {
    paths: redactionPaths,
    censor: "[REDACTED]"
  }
});
