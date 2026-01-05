import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async.handler";
import { AuthService } from "../services/auth.service";
import { sendSuccess } from "../utils/api.response";
import { requireFields } from "../utils/validate";

export const AuthController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    requireFields(req.body, ["email", "password"]);

    const result = await AuthService.login(req.body);
    sendSuccess(res, result, "Login successful");
  }),

  register: asyncHandler(async (req: Request, res: Response) => {
    requireFields(req.body, ["email", "password", "first_name", "last_name"]);

    const result = await AuthService.register(req.body);
    sendSuccess(res, result, "Register successful");
  }),
};
