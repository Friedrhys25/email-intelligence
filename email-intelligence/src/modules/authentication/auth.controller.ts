import type { RequestHandler } from "express";
import { env } from "../../config/env.js";
import { AuthService } from "./auth.service.js";

export class AuthController {
  public constructor(private readonly authService = new AuthService()) {}

  public redirectToGoogle: RequestHandler = (_request, response, next) => {
    try {
      response.redirect(this.authService.getAuthorizationUrl());
    } catch (error) {
      next(error);
    }
  };

  public handleGoogleCallback: RequestHandler = async (request, response, next) => {
    try {
      const code = typeof request.query.code === "string" ? request.query.code : undefined;
      const result = await this.authService.handleCallback(code);

      if (!env.EXPOSE_REFRESH_TOKEN_ON_CALLBACK) {
        const { refreshToken: _refreshToken, ...safeResult } = result;

        response.status(200).json(safeResult);
        return;
      }

      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
