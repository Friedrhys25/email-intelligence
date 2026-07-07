import { randomUUID } from "node:crypto";
import { env } from "../../config/env.js";
import { logger } from "../../shared/logger.js";
import type { EmailDTO } from "../gmail/email.dto.js";
import { GmailService } from "../gmail/gmail.service.js";
import { EmailProcessorService } from "../email-processor/email-processor.service.js";
import type { ProcessedEmail } from "../email-processor/priority.types.js";
import { PromptBuilderService } from "../prompt-builder/prompt-builder.service.js";
import type { BuiltPrompt } from "../prompt-builder/prompt.types.js";
import { GeminiService } from "../gemini/gemini.service.js";
import type { SummaryResponse } from "../gemini/summary.schema.js";
import { DigestFormatterService } from "../formatter/digest-formatter.service.js";
import { DiscordDispatcherService } from "../dispatcher/discord-dispatcher.service.js";
import type { DeliveryResult } from "../dispatcher/dispatcher.types.js";
import type { DigestRunResult } from "./orchestrator.types.js";

export interface GmailReader {
  fetchLatestEmails(limit?: number): Promise<EmailDTO[]>;
}

export interface EmailProcessor {
  process(emails: EmailDTO[]): ProcessedEmail[];
}

export interface PromptBuilder {
  build(processedEmails: ProcessedEmail[]): BuiltPrompt;
}

export interface AiSummarizer {
  summarize(prompt: BuiltPrompt): Promise<SummaryResponse>;
}

export interface DigestFormatter {
  format(summaryResponse: SummaryResponse): string;
}

export interface DigestDispatcher {
  dispatch(request: { markdown: string; correlationId: string }): Promise<DeliveryResult>;
}

export class InboxOrchestratorService {
  public constructor(
    private readonly gmailReader: GmailReader = new GmailService(),
    private readonly emailProcessor: EmailProcessor = new EmailProcessorService(),
    private readonly promptBuilder: PromptBuilder = new PromptBuilderService(),
    private readonly aiSummarizer: AiSummarizer = new GeminiService(),
    private readonly digestFormatter: DigestFormatter = new DigestFormatterService(),
    private readonly digestDispatcher: DigestDispatcher = new DiscordDispatcherService()
  ) {}

  public async runDigest(): Promise<DigestRunResult> {
    const runId = randomUUID();
    const startedAtDate = new Date();
    const startedAt = startedAtDate.toISOString();

    try {
      logger.info({ runId }, "Inbox digest run started");

      const emails = await this.gmailReader.fetchLatestEmails(env.EMAIL_FETCH_LIMIT);
      const processedEmails = this.emailProcessor.process(emails);
      const prompt = this.promptBuilder.build(processedEmails);
      const summaryResponse = await this.aiSummarizer.summarize(prompt);
      const markdown = this.digestFormatter.format(summaryResponse);
      const deliveryResult = await this.digestDispatcher.dispatch({
        markdown,
        correlationId: runId
      });

      const completedAtDate = new Date();
      const result: DigestRunResult = {
        runId,
        status: deliveryResult.status === "failed" ? "failed" : "completed",
        fetched: emails.length,
        included: processedEmails.length,
        summarized: summaryResponse.summaries.length,
        dispatched: deliveryResult.status === "sent",
        startedAt,
        completedAt: completedAtDate.toISOString(),
        durationMs: completedAtDate.getTime() - startedAtDate.getTime(),
        deliveryResult,
        errors: deliveryResult.errorMessage ? [deliveryResult.errorMessage] : []
      };

      logger.info(
        {
          runId,
          fetched: result.fetched,
          included: result.included,
          summarized: result.summarized,
          dispatched: result.dispatched,
          durationMs: result.durationMs
        },
        "Inbox digest run completed"
      );

      return result;
    } catch (error) {
      const completedAtDate = new Date();
      const errorMessage = error instanceof Error ? error.message : "Unknown digest run error";

      logger.error({ runId, error }, "Inbox digest run failed");

      return {
        runId,
        status: "failed",
        fetched: 0,
        included: 0,
        summarized: 0,
        dispatched: false,
        startedAt,
        completedAt: completedAtDate.toISOString(),
        durationMs: completedAtDate.getTime() - startedAtDate.getTime(),
        errors: [errorMessage]
      };
    }
  }
}
