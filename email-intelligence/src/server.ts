import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { SchedulerService } from "./modules/scheduler/scheduler.service.js";
import { logger } from "./shared/logger.js";

const scheduler = new SchedulerService();
const app = createApp(scheduler);

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, "Inbox Intelligence API started");
  scheduler.start();
});

const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
  logger.info({ signal }, "Shutting down Inbox Intelligence API");
  await scheduler.stop();

  server.close((error) => {
    if (error) {
      logger.error({ error }, "Failed to close HTTP server cleanly");
      process.exit(1);
    }

    process.exit(0);
  });
};

process.on("SIGINT", (signal) => {
  void shutdown(signal);
});
process.on("SIGTERM", (signal) => {
  void shutdown(signal);
});
