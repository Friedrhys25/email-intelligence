export interface DispatchRequest {
  markdown: string;
  correlationId: string;
}

export interface DeliveryResult {
  status: "sent" | "failed" | "skipped";
  provider: "discord";
  deliveredAt: string | null;
  correlationId: string;
  statusCode?: number;
  errorMessage?: string;
}

export interface DiscordDispatcherConfig {
  webhookUrl?: string;
  retryAttempts: number;
  retryDelayMs: number;
}
