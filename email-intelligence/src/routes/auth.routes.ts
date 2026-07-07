import { Router } from "express";
import { AuthController } from "../modules/authentication/auth.controller.js";

export const createAuthRouter = (controller = new AuthController()): Router => {
  const router = Router();

  router.get("/auth/google", controller.redirectToGoogle);
  router.get("/auth/google/callback", controller.handleGoogleCallback);

  return router;
};
