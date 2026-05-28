import { Router } from "express";
import MetricsController from "./metricsController.js";

const router = Router();

router.get("/orders-stats", MetricsController.getOrdersStats);
router.get("/status-stats", MetricsController.getStatusStats);

export default router;