import { Router } from "express";
import MetricsController from "./metricsController.js";

const router = Router();

router.get("/orders-stats", MetricsController.getOrdersStats);

export default router;