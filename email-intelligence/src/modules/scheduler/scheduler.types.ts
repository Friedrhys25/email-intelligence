import type { DigestRunResult } from "../orchestrator/orchestrator.types.js";

export interface ScheduledDigestJob {
  runDigest(): Promise<DigestRunResult>;
}

export interface SchedulerConfig {
  cronExpression: string;
  enabled: boolean;
  timezone: string;
}

export interface ScheduledTaskHandle {
  start(): void | Promise<void>;
  stop(): void | Promise<void>;
}

export interface CronScheduler {
  validate(cronExpression: string): boolean;
  schedule(
    cronExpression: string,
    task: () => void | Promise<void>,
    timezone: string
  ): ScheduledTaskHandle;
}

export interface SchedulerRunResult {
  status: "completed" | "failed" | "skipped";
  reason?: string;
  digestRun?: DigestRunResult;
}
