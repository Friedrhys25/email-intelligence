import type { ProcessedEmail } from "../email-processor/priority.types.js";

export interface PromptBuilderConfig {
  maxBodyExcerptLength: number;
}

export interface BuiltPrompt {
  systemPrompt: string;
  userPrompt: string;
  responseSchema: string;
  emailCount: number;
}

export interface PromptEmailInput {
  id: string;
  sender: string;
  subject: string;
  date: string;
  snippet: string;
  bodyExcerpt: string;
  priority: ProcessedEmail["priority"];
  category: ProcessedEmail["category"];
  actionRequired: boolean;
  deadline?: string;
  importantContact: boolean;
  reasonIncluded: string;
}
