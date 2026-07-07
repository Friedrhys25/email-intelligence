import { z } from "zod";

export const emailSummarySchema = z.object({
  emailId: z.string().min(1),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  sender: z.string(),
  subject: z.string(),
  summary: z.string().min(1),
  reason: z.string().nullable().default(null),
  actionRequired: z.boolean().default(false),
  deadline: z.string().nullable().default(null),
  confidence: z.coerce.number().min(0).max(1).default(0.5)
});

export const summaryResponseSchema = z.object({
  summaries: z.array(emailSummarySchema)
});

export type EmailSummary = z.infer<typeof emailSummarySchema>;
export type SummaryResponse = z.infer<typeof summaryResponseSchema>;
