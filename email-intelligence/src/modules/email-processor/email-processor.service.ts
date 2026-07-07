import type { EmailDTO } from "../gmail/email.dto.js";
import { analyzeEmail, classifyPriority, defaultEmailProcessorConfig } from "./email-rules.js";
import type { EmailProcessorConfig, ProcessedEmail } from "./priority.types.js";

export class EmailProcessorService {
  public constructor(private readonly config: EmailProcessorConfig = defaultEmailProcessorConfig) {}

  public process(emails: EmailDTO[]): ProcessedEmail[] {
    return emails.flatMap((email) => {
      const analysis = analyzeEmail(email, this.config);

      if (analysis.ignored) {
        return [];
      }

      return [
        {
          email,
          priority: classifyPriority(analysis.score),
          category: analysis.category,
          actionRequired: analysis.actionRequired,
          deadline: analysis.deadline,
          importantContact: analysis.importantContact,
          reasonIncluded: analysis.reasonIncluded,
          score: analysis.score
        }
      ];
    });
  }
}
