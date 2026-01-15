import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async.handler";
import { allowedFields, requireFields } from "../utils/validate";
import { BudgetService } from "../services/budget.service";
import { sendSuccess } from "../utils/api.response";
import { AuthRequest } from "../middlewares/auth.middleware";

export const BudgetController = {
  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    allowedFields(req.body, ["name", "description", "amount"]);

    const user_id = req.user!.id;

    const result = await BudgetService.create({
      user_id: user_id,
      name: req.body.name,
      description: req.body.description,
      amount: req.body.amount,
    });

    sendSuccess(res, result, "Creation successful");
  }),

  getAll: asyncHandler(async (req: AuthRequest, res: Response) => {
    const user_id = req.user!.id;
    const result = await BudgetService.getAll(user_id);
    sendSuccess(res, result, "Budgets fetched");
  }),

  getOne: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await BudgetService.getOne(id as string);
    sendSuccess(res, result, "Budget fetched");
  }),

  pin: asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id;
    const user_id = req.user!.id;
    const result = await BudgetService.pin(id as string, user_id);
    sendSuccess(res, result, "Budget pinned");
  }),

  unpin: asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id;
    const user_id = req.user!.id;

    const wasUnpinned = await BudgetService.unpin(id as string, user_id);

    if (!wasUnpinned) {
      return sendSuccess(res, false, "Budget is already unpinned");
    }

    sendSuccess(res, true, "Budget unpinned successfully");
  }),

  edit: asyncHandler(async (req: AuthRequest, res: Response) => {
    allowedFields(req.body, ["name", "description", "amount"]);

    const id = req.params.id;
    const user_id = req.user!.id;
    const data = req.body;

    const result = await BudgetService.edit(id as string, user_id, data);

    sendSuccess(res, result, "Budget edited");
  }),

  delete: asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id;
    const user_id = req.user!.id;
    const result = await BudgetService.delete(id as string, user_id);
    sendSuccess(res, result, "Budget deleted");
  }),
};
