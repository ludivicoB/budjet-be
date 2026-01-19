import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { TransactionController } from "../controllers/transaction.controller";

const router = Router();

router.use(authenticate);
router.get("/", TransactionController.getAll);
router.get("/budget/:id", TransactionController.getAllPerBudget);
router.post("/", TransactionController.create);
router.patch("/:id", TransactionController.edit);
router.delete("/:id", TransactionController.delete);

export default router;
