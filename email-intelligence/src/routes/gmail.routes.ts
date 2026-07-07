import { Router } from "express";
import { env } from "../config/env.js";
import { GmailService } from "../modules/gmail/gmail.service.js";

export const createGmailRouter = (gmailService = new GmailService()): Router => {
  const router = Router();

  router.get("/gmail/latest", async (request, response, next) => {
    try {
      const rawLimit =
        typeof request.query.limit === "string" ? Number(request.query.limit) : undefined;
      const limit =
        rawLimit && Number.isInteger(rawLimit) && rawLimit > 0 ? rawLimit : env.EMAIL_FETCH_LIMIT;
      const emails = await gmailService.fetchLatestEmails(limit);

      response.status(200).json({
        count: emails.length,
        emails
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
