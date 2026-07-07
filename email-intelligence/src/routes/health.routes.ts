import { Router } from "express";

export const createHealthRouter = (): Router => {
  const router = Router();

  router.get("/health", (_request, response) => {
    response.status(200).json({
      status: "ok",
      service: "inbox-intelligence",
      version: "1.0"
    });
  });

  return router;
};
