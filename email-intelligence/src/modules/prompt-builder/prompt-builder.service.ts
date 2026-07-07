import type { ProcessedEmail } from "../email-processor/priority.types.js";
import { inboxIntelligenceSystemPrompt, summaryResponseSchema } from "./prompts.js";
import type { BuiltPrompt, PromptBuilderConfig, PromptEmailInput } from "./prompt.types.js";

const secretPatterns = [
  /GOOGLE_REFRESH_TOKEN\s*=\s*\S+/giu,
  /GOOGLE_CLIENT_SECRET\s*=\s*\S+/giu,
  /GEMINI_API_KEY\s*=\s*\S+/giu,
  /DISCORD_WEBHOOK_URL\s*=\s*\S+/giu,
  /\bya29\.[\w.-]+/giu,
  /\bghp_[\w]+/giu
];

export class PromptBuilderService {
  public constructor(
    private readonly config: PromptBuilderConfig = {
      maxBodyExcerptLength: 800
    }
  ) {}

  public build(processedEmails: ProcessedEmail[]): BuiltPrompt {
    const promptEmails = processedEmails.map((processedEmail) =>
      this.toPromptEmail(processedEmail)
    );

    return {
      systemPrompt: inboxIntelligenceSystemPrompt,
      userPrompt: this.buildUserPrompt(promptEmails),
      responseSchema: summaryResponseSchema,
      emailCount: promptEmails.length
    };
  }

  private buildUserPrompt(emails: PromptEmailInput[]): string {
    if (emails.length === 0) {
      return [
        "No important emails were found for this digest.",
        "Return JSON with an empty summaries array.",
        summaryResponseSchema
      ].join("\n\n");
    }

    return [
      "Create an Inbox Intelligence digest from these processed emails.",
      "Use the provided priority, actionRequired, deadline, and reasonIncluded fields as primary signals.",
      "For job rejection emails, set reason to the rejection reason if stated, otherwise the clearest rejection signal.",
      "For interview schedule emails, set reason to the interview schedule details or scheduling request.",
      "For other emails, set reason to the main reason this email matters.",
      "If an email appears low-value despite being included, omit it from summaries.",
      "Emails:",
      JSON.stringify(emails, null, 2),
      summaryResponseSchema
    ].join("\n\n");
  }

  private toPromptEmail(processedEmail: ProcessedEmail): PromptEmailInput {
    return {
      id: processedEmail.email.id,
      sender: sanitizePromptText(processedEmail.email.sender),
      subject: sanitizePromptText(processedEmail.email.subject),
      date: processedEmail.email.date,
      snippet: sanitizePromptText(processedEmail.email.snippet),
      bodyExcerpt: this.createBodyExcerpt(processedEmail.email.body),
      priority: processedEmail.priority,
      category: processedEmail.category,
      actionRequired: processedEmail.actionRequired,
      deadline: processedEmail.deadline,
      importantContact: processedEmail.importantContact,
      reasonIncluded: processedEmail.reasonIncluded
    };
  }

  private createBodyExcerpt(body: string): string {
    const sanitizedBody = sanitizePromptText(body).trim();

    if (sanitizedBody.length <= this.config.maxBodyExcerptLength) {
      return sanitizedBody;
    }

    return `${sanitizedBody.slice(0, this.config.maxBodyExcerptLength).trimEnd()}...`;
  }
}

export const sanitizePromptText = (value: string): string =>
  secretPatterns.reduce(
    (sanitizedValue, pattern) => sanitizedValue.replace(pattern, "[REDACTED]"),
    value
  );
