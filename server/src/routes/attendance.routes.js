import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  getStatusHandler,
  punchHandler,
  getDailySummaryHandler,
  getWeeklySummaryHandler,
  getPunchesHandler,
} from "../controllers/attendance.controller.js";

const router = Router();

router.use(verifyToken);

router.get("/status", getStatusHandler);
router.post("/punch", punchHandler);
router.get("/summary/daily", getDailySummaryHandler);
router.get("/summary/weekly", getWeeklySummaryHandler);
router.get("/punches", getPunchesHandler);

export default router;
