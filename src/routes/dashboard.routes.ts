import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { DashboardController } from "../controllers/dashboard.controller";

const router = Router();
router.use(authenticate);

router.get("/", DashboardController.dashboard);

export default router;
