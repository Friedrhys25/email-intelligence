import { z } from "zod";

export const emailSummarySchema = z.object({
  emailId: z.string().min(1),
  priority: z.enum(["high", "medium", "low"]),
  sender: z.string(),
  subject: z.string(),
  summary: z.string().min(1),
  reason: z.string().nullable(),
  actionRequired: z.boolean(),
  deadline: z.string().nullable(),
  confidence: z.number().min(0).max(1)
});

export const summaryResponseSchema = z.object({
  summaries: z.array(emailSummarySchema)
});

export type EmailSummary = z.infer<typeof emailSummarySchema>;
export type SummaryResponse = z.infer<typeof summaryResponseSchema>;
