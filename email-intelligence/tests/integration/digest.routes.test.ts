import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import express, { type ErrorRequestHandler } from "express";
import { createDigestRouter } from "../../src/routes/digest.routes.js";
import { AppError } from "../../src/shared/errors.js";
import type { SchedulerService } from "../../src/modules/scheduler/scheduler.service.js";
import type { SchedulerRunResult } from "../../src/modules/scheduler/scheduler.types.js";

const schedulerResult: SchedulerRunResult = {
  status: "completed",
  digestRun: {
    runId: "run-1",
    status: "completed",
    fetched: 10,
    included: 1,
    summarized: 1,
    dispatched: true,
    startedAt: "2026-07-07T10:00:00.000Z",
    completedAt: "2026-07-07T10:00:02.000Z",
    durationMs: 2000,
    errors: []
  }
};

const createTestApp = (
  scheduler: Pick<SchedulerService, "executeScheduledRun">,
  manualRunToken?: string
) => {
  const app = express();

  app.use(
    createDigestRouter(scheduler as SchedulerService, {
      manualRunToken
    })
  );
  app.use(errorHandler);

  return app;
};

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  const appError = error instanceof AppError ? error : new AppError("Internal server error", 500);

  response.status(appError.statusCode).json({
    error: {
      message: appError.message
    }
  });
};

describe("POST /digest/run", () => {
  it("runs the digest when authorized", async () => {
    const executeScheduledRun = vi.fn(() => Promise.resolve(schedulerResult));
    const app = createTestApp({ executeScheduledRun }, "manual-secret");

    const response = await request(app)
      .post("/digest/run")
      .set("Authorization", "Bearer manual-secret")
      .expect(202);

    expect(response.body).toEqual(schedulerResult);
    expect(executeScheduledRun).toHaveBeenCalledOnce();
  });

  it("rejects requests without the configured token", async () => {
    const executeScheduledRun = vi.fn(() => Promise.resolve(schedulerResult));
    const app = createTestApp({ executeScheduledRun }, "manual-secret");

    const response = await request(app).post("/digest/run").expect(401);

    expect(response.body).toEqual({
      error: {
        message: "Unauthorized manual digest run"
      }
    });
    expect(executeScheduledRun).not.toHaveBeenCalled();
  });

  it("returns unavailable when manual runs are not configured", async () => {
    const executeScheduledRun = vi.fn(() => Promise.resolve(schedulerResult));
    const app = createTestApp({ executeScheduledRun });

    const response = await request(app)
      .post("/digest/run")
      .set("Authorization", "Bearer manual-secret")
      .expect(503);

    expect(response.body).toEqual({
      error: {
        message: "Manual digest run is not configured"
      }
    });
    expect(executeScheduledRun).not.toHaveBeenCalled();
  });
});
