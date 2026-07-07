import { describe, expect, it, vi } from "vitest";
import { SchedulerService } from "../../src/modules/scheduler/scheduler.service.js";
import type {
  CronScheduler,
  ScheduledDigestJob,
  ScheduledTaskHandle
} from "../../src/modules/scheduler/scheduler.types.js";
import type { DigestRunResult } from "../../src/modules/orchestrator/orchestrator.types.js";

const digestRunResult: DigestRunResult = {
  runId: "run-1",
  status: "completed",
  fetched: 1,
  included: 1,
  summarized: 1,
  dispatched: true,
  startedAt: "2026-07-04T07:00:00.000Z",
  completedAt: "2026-07-04T07:00:01.000Z",
  durationMs: 1000,
  errors: []
};

const createScheduledTask = (): ScheduledTaskHandle => ({
  start: vi.fn(),
  stop: vi.fn()
});

describe("SchedulerService", () => {
  it("does not schedule jobs when disabled", () => {
    const schedule = vi.fn(() => createScheduledTask());
    const cronScheduler: CronScheduler = {
      validate: vi.fn(() => true),
      schedule
    };
    const service = new SchedulerService(
      { runDigest: vi.fn(() => Promise.resolve(digestRunResult)) },
      cronScheduler,
      {
        cronExpression: "*/30 * * * *",
        enabled: false
      }
    );

    expect(service.start()).toBeUndefined();
    expect(schedule).not.toHaveBeenCalled();
  });

  it("validates cron expressions before scheduling", () => {
    const cronScheduler: CronScheduler = {
      validate: vi.fn(() => false),
      schedule: vi.fn(() => createScheduledTask())
    };
    const service = new SchedulerService(
      { runDigest: vi.fn(() => Promise.resolve(digestRunResult)) },
      cronScheduler,
      {
        cronExpression: "invalid",
        enabled: true
      }
    );

    expect(() => service.start()).toThrow("Invalid DIGEST_CRON expression: invalid");
  });

  it("schedules digest jobs when enabled", () => {
    const schedule = vi.fn(() => createScheduledTask());
    const cronScheduler: CronScheduler = {
      validate: vi.fn(() => true),
      schedule
    };
    const service = new SchedulerService(
      { runDigest: vi.fn(() => Promise.resolve(digestRunResult)) },
      cronScheduler,
      {
        cronExpression: "*/30 * * * *",
        enabled: true
      }
    );

    expect(service.start()).toBeDefined();
    expect(schedule).toHaveBeenCalledWith("*/30 * * * *", expect.any(Function));
  });

  it("executes the orchestrator", async () => {
    const runDigest = vi.fn(() => Promise.resolve(digestRunResult));
    const digestJob: ScheduledDigestJob = {
      runDigest
    };
    const service = new SchedulerService(
      digestJob,
      {
        validate: vi.fn(() => true),
        schedule: vi.fn(() => createScheduledTask())
      },
      {
        cronExpression: "*/30 * * * *",
        enabled: true
      }
    );

    await expect(service.executeScheduledRun()).resolves.toMatchObject({
      status: "completed",
      digestRun: digestRunResult
    });
    expect(runDigest).toHaveBeenCalledOnce();
  });

  it("skips duplicate active runs", async () => {
    let resolveRun: ((value: DigestRunResult) => void) | undefined;
    const digestJob: ScheduledDigestJob = {
      runDigest: vi.fn(
        () =>
          new Promise<DigestRunResult>((resolve) => {
            resolveRun = resolve;
          })
      )
    };
    const service = new SchedulerService(
      digestJob,
      {
        validate: vi.fn(() => true),
        schedule: vi.fn(() => createScheduledTask())
      },
      {
        cronExpression: "*/30 * * * *",
        enabled: true
      }
    );

    const firstRun = service.executeScheduledRun();

    await expect(service.executeScheduledRun()).resolves.toMatchObject({
      status: "skipped",
      reason: "Digest run already active"
    });

    resolveRun?.(digestRunResult);
    await firstRun;
  });

  it("returns failed scheduler status and releases the lock after failures", async () => {
    const digestJob: ScheduledDigestJob = {
      runDigest: vi
        .fn()
        .mockRejectedValueOnce(new Error("orchestrator failed"))
        .mockResolvedValueOnce(digestRunResult)
    };
    const service = new SchedulerService(
      digestJob,
      {
        validate: vi.fn(() => true),
        schedule: vi.fn(() => createScheduledTask())
      },
      {
        cronExpression: "*/30 * * * *",
        enabled: true
      }
    );

    await expect(service.executeScheduledRun()).resolves.toMatchObject({
      status: "failed",
      reason: "orchestrator failed"
    });
    await expect(service.executeScheduledRun()).resolves.toMatchObject({
      status: "completed"
    });
  });
});
