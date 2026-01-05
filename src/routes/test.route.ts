import { Router } from "express";
import { TestController } from "../controllers/test.controller";

const router = Router();

router.get("/test", TestController.test);

export default router;
