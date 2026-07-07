import type { EmailDTO } from "../gmail/email.dto.js";

export type EmailPriority = "high" | "medium" | "low";

export type EmailCategory =
  | "action"
  | "deadline"
  | "important-contact"
  | "normal"
  | "newsletter"
  | "otp"
  | "promotion"
  | "receipt"
  | "spam";

export interface EmailProcessorConfig {
  ignoreNewsletters: boolean;
  importantContacts: string[];
}

export interface ProcessedEmail {
  email: EmailDTO;
  priority: EmailPriority;
  category: EmailCategory;
  actionRequired: boolean;
  deadline?: string;
  importantContact: boolean;
  reasonIncluded: string;
  score: number;
}

export interface EmailAnalysis {
  category: EmailCategory;
  actionRequired: boolean;
  deadline?: string;
  importantContact: boolean;
  score: number;
  reasonIncluded: string;
  ignored: boolean;
}
