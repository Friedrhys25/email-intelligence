import cron from "node-cron";
import type { CronScheduler, ScheduledTaskHandle } from "./scheduler.types.js";

export class NodeCronScheduler implements CronScheduler {
  public validate(cronExpression: string): boolean {
    return cron.validate(cronExpression);
  }

  public schedule(cronExpression: string, task: () => void | Promise<void>): ScheduledTaskHandle {
    return cron.schedule(cronExpression, task, {
      noOverlap: true,
      name: "inbox-intelligence-digest",
      timezone: "UTC"
    });
  }
}
