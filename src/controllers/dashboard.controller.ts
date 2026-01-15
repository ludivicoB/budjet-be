import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { sendSuccess } from "../utils/api.response";
import { DashboardService } from "../services/dashboard.service";
import { asyncHandler } from "../middlewares/async.handler";

export const DashboardController = {
  dashboard: asyncHandler(async (req: AuthRequest, res: Response) => {
    const user_id = req.user!.id;

    const result = await DashboardService.getDashboard(user_id);

    sendSuccess(res, result, "Dashboard fetched");
  }),
};
