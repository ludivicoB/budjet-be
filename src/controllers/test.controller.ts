import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async.handler";
import { sendSuccess } from "../utils/api.response";
import { TestService } from "../services/test.service";

export const TestController = {
  test: asyncHandler(async (_: Request, res: Response) => {
    const result = await TestService.getTest();
    sendSuccess(res, result, "Test successful");
  }),
};
