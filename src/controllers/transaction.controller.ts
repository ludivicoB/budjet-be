import { Response } from "express";
import { asyncHandler } from "../middlewares/async.handler";
import { allowedFields, requireFields } from "../utils/validate";
import { TransactionService } from "../services/transaction.service";
import { sendSuccess } from "../utils/api.response";
import { AuthRequest } from "../middlewares/auth.middleware";

export const TransactionController = {
  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    requireFields(req.body, ["budget_id", "amount", "type", "description",]);

    allowedFields(req.body, [
      "budget_id",
      "amount",
      "type",
      "description",
      "category",
      "transaction_date"
    ]);

    const user_id = req.user!.id;

    const result = await TransactionService.create(
      user_id,
      req.body.budget_id,
      {
        amount: req.body.amount,
        type: req.body.type,
        description: req.body.description,
        category: req.body.category,
        transaction_date: req.body.transaction_date
      }
    );

    sendSuccess(res, result, "Transaction created");
  }),

  getAll: asyncHandler(async (req: AuthRequest, res: Response) => {
    const user_id = req.user!.id;
    console.log("user_id", user_id);
    const result = await TransactionService.getAll(user_id);
    sendSuccess(res, result, "Transactions fetched");
  }),

  getAllPerBudget: asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await TransactionService.getAllPerBudget(req.user!.id, req.params.id as string);
    sendSuccess(res, result, "Transactions fetched");
  }),

  edit: asyncHandler(async (req: AuthRequest, res: Response) => {
    allowedFields(req.body, [
      "amount",
      "description",
      "category",
      "transaction_date",
    ])
    const result = await TransactionService.edit(req.user!.id, req.params.id as string, req.body);
    sendSuccess(res, result, "Transaction edited");
  }),

  delete: asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await TransactionService.delete(req.user!.id, req.params.id as string);
    sendSuccess(res, result, "Transaction deleted");
  }),
};
