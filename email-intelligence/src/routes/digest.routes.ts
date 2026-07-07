import { Router } from "express";
import { env } from "../config/env.js";
import { SchedulerService } from "../modules/scheduler/scheduler.service.js";
import { AppError } from "../shared/errors.js";

export interface DigestRouterConfig {
  manualRunToken?: string;
}

export const createDigestRouter = (
  scheduler = new SchedulerService(),
  config: DigestRouterConfig = {
    manualRunToken: env.MANUAL_RUN_TOKEN
  }
): Router => {
  const router = Router();

  router.post("/digest/run", async (request, response, next) => {
    try {
      assertManualRunAuthorized(request.headers.authorization, config.manualRunToken);

      const result = await scheduler.executeScheduledRun();

      response.status(202).json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
};

const assertManualRunAuthorized = (
  authorizationHeader: string | undefined,
  manualRunToken: string | undefined
): void => {
  if (!manualRunToken) {
    throw new AppError("Manual digest run is not configured", 503);
  }

  const token = parseBearerToken(authorizationHeader);

  if (token !== manualRunToken) {
    throw new AppError("Unauthorized manual digest run", 401);
  }
};

const parseBearerToken = (authorizationHeader?: string): string | undefined => {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return undefined;
  }

  return authorizationHeader.slice("Bearer ".length).trim();
};
