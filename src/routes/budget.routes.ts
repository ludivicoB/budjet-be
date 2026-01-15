import { Router } from "express";
import { BudgetController } from "../controllers/budget.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);
router.get("/", BudgetController.getAll);
router.post("/", BudgetController.create);
router.get("/:id", BudgetController.getOne);
router.put("/:id", BudgetController.edit);
router.put("/pin/:id", BudgetController.pin);
router.put("/unpin/:id", BudgetController.unpin);
router.delete("/:id", BudgetController.delete);

export default router;
