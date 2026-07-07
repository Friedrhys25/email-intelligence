import { env } from "../../config/env.js";
import { logger } from "../../shared/logger.js";
import { InboxOrchestratorService } from "../orchestrator/inbox-orchestrator.service.js";
import { NodeCronScheduler } from "./node-cron.scheduler.js";
import type {
  CronScheduler,
  ScheduledDigestJob,
  ScheduledTaskHandle,
  SchedulerConfig,
  SchedulerRunResult
} from "./scheduler.types.js";

export class SchedulerService {
  private scheduledTask?: ScheduledTaskHandle;
  private activeRun = false;

  public constructor(
    private readonly digestJob: ScheduledDigestJob = new InboxOrchestratorService(),
    private readonly cronScheduler: CronScheduler = new NodeCronScheduler(),
    private readonly config: SchedulerConfig = {
      cronExpression: env.DIGEST_CRON,
      enabled: env.SCHEDULER_ENABLED
    }
  ) {}

  public start(): ScheduledTaskHandle | undefined {
    if (!this.config.enabled) {
      logger.info("Digest scheduler disabled");
      return undefined;
    }

    if (!this.cronScheduler.validate(this.config.cronExpression)) {
      throw new Error(`Invalid DIGEST_CRON expression: ${this.config.cronExpression}`);
    }

    this.scheduledTask = this.cronScheduler.schedule(this.config.cronExpression, async () => {
      await this.executeScheduledRun();
    });

    logger.info({ cronExpression: this.config.cronExpression }, "Digest scheduler started");

    return this.scheduledTask;
  }

  public async stop(): Promise<void> {
    await this.scheduledTask?.stop();
    this.scheduledTask = undefined;
  }

  public async executeScheduledRun(): Promise<SchedulerRunResult> {
    if (this.activeRun) {
      logger.warn("Skipping digest run because a previous run is still active");
      return {
        status: "skipped",
        reason: "Digest run already active"
      };
    }

    this.activeRun = true;

    try {
      const digestRun = await this.digestJob.runDigest();

      return {
        status: digestRun.status,
        digestRun
      };
    } catch (error) {
      logger.error({ error }, "Scheduled digest run failed");

      return {
        status: "failed",
        reason: error instanceof Error ? error.message : "Unknown scheduled digest failure"
      };
    } finally {
      this.activeRun = false;
    }
  }
}
