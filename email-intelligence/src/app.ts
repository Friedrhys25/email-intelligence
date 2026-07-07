import express, { type ErrorRequestHandler, type Express } from "express";
import { pinoHttp } from "pino-http";
import { AppError } from "./shared/errors.js";
import { logger } from "./shared/logger.js";
import { createAuthRouter } from "./routes/auth.routes.js";
import { createGmailRouter } from "./routes/gmail.routes.js";
import { createHealthRouter } from "./routes/health.routes.js";

export const createApp = (): Express => {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json({ limit: "1mb" }));
  app.use(
    pinoHttp({
      logger
    })
  );

  app.use(createAuthRouter());
  app.use(createGmailRouter());
  app.use(createHealthRouter());

  app.use((_request, _response, next) => {
    next(new AppError("Route not found", 404));
  });

  app.use(errorHandler);

  return app;
};

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  const appError =
    error instanceof AppError ? error : new AppError("Internal server error", 500, false);

  if (appError.statusCode >= 500) {
    logger.error({ error }, appError.message);
  }

  response.status(appError.statusCode).json({
    error: {
      message: appError.message
    }
  });
};
