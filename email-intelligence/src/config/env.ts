import "dotenv/config";
import { z } from "zod";

const productionRequiredKeys = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REDIRECT_URI",
  "GOOGLE_REFRESH_TOKEN",
  "GEMINI_API_KEY",
  "DISCORD_WEBHOOK_URL"
] as const;

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(3000),
    LOG_LEVEL: z
      .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
      .default("info"),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GOOGLE_REDIRECT_URI: z.string().url().optional(),
    GOOGLE_REFRESH_TOKEN: z.string().optional(),
    GEMINI_API_KEY: z.string().optional(),
    DISCORD_WEBHOOK_URL: z.string().url().optional(),
    EXPOSE_REFRESH_TOKEN_ON_CALLBACK: z
      .enum(["true", "false"])
      .default("false")
      .transform((value) => value === "true"),
    EMAIL_FETCH_LIMIT: z.coerce.number().int().positive().default(10),
    DIGEST_CRON: z.string().default("0 10,21 * * *"),
    SCHEDULER_TIMEZONE: z.string().default("Asia/Manila"),
    SCHEDULER_ENABLED: z
      .enum(["true", "false"])
      .default("false")
      .transform((value) => value === "true")
  })
  .superRefine((value, context) => {
    if (value.NODE_ENV !== "production") {
      return;
    }

    for (const key of productionRequiredKeys) {
      const envValue = value[key];

      if (!envValue || envValue.trim().length === 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: [key],
          message: "Required in production"
        });
      }
    }
  });

export type Env = z.infer<typeof envSchema>;

export const loadEnv = (source: NodeJS.ProcessEnv = process.env): Env => {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");

    throw new Error(`Invalid environment configuration: ${details}`);
  }

  return result.data;
};

export const env = loadEnv();
