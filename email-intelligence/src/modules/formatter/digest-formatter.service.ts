import type { EmailSummary, SummaryResponse } from "../gemini/summary.schema.js";

export interface DigestFormatterConfig {
  maxDiscordMessageLength: number;
}

const priorityOrder: EmailSummary["priority"][] = ["high", "medium", "low"];

const priorityHeadings: Record<EmailSummary["priority"], string> = {
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority"
};

export class DigestFormatterService {
  public constructor(
    private readonly config: DigestFormatterConfig = {
      maxDiscordMessageLength: 2000
    }
  ) {}

  public format(summaryResponse: SummaryResponse): string {
    const digest =
      summaryResponse.summaries.length === 0
        ? this.formatEmptyDigest()
        : this.formatSummaries(summaryResponse.summaries);

    return this.enforceDiscordLimit(digest);
  }

  private formatEmptyDigest(): string {
    return ["# Inbox Intelligence", "", "No important emails found for this digest."].join("\n");
  }

  private formatSummaries(summaries: EmailSummary[]): string {
    const sections = priorityOrder
      .map((priority) => this.formatPrioritySection(priority, summaries))
      .filter((section) => section.length > 0);

    return ["# Inbox Intelligence", "", ...sections].join("\n\n");
  }

  private formatPrioritySection(
    priority: EmailSummary["priority"],
    summaries: EmailSummary[]
  ): string {
    const prioritySummaries = summaries.filter((summary) => summary.priority === priority);

    if (prioritySummaries.length === 0) {
      return "";
    }

    return [
      `## ${priorityHeadings[priority]}`,
      "",
      prioritySummaries.map((summary) => this.formatSummary(summary)).join("\n\n---\n\n")
    ].join("\n");
  }

  private formatSummary(summary: EmailSummary): string {
    const actionText = summary.actionRequired ? "Yes" : "No";
    const deadlineText = summary.deadline ?? "Not specified";

    return [
      `### ${sanitizeMarkdown(summary.sender)} - ${sanitizeMarkdown(summary.subject)}`,
      `Summary: ${sanitizeMarkdown(summary.summary)}`,
      `Action Required: ${actionText}`,
      `Deadline: ${sanitizeMarkdown(deadlineText)}`,
      `Confidence: ${String(Math.round(summary.confidence * 100))}%`
    ].join("\n");
  }

  private enforceDiscordLimit(digest: string): string {
    if (digest.length <= this.config.maxDiscordMessageLength) {
      return digest;
    }

    const suffix = "\n\n_Trimmed to fit Discord message limits._";
    return `${digest.slice(0, this.config.maxDiscordMessageLength - suffix.length).trimEnd()}${suffix}`;
  }
}

export const sanitizeMarkdown = (value: string): string =>
  value
    .replace(/[`*_~|]/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
