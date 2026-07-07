import type { DeliveryResult } from "../dispatcher/dispatcher.types.js";

export type DigestRunStatus = "completed" | "failed";

export interface DigestRunResult {
  runId: string;
  status: DigestRunStatus;
  fetched: number;
  included: number;
  summarized: number;
  dispatched: boolean;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  deliveryResult?: DeliveryResult;
  errors: string[];
}
