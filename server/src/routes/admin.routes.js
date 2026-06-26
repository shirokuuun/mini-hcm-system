import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import requireAdmin from "../middleware/requireAdmin.js";
import {
  getEmployeesHandler,
  getDailyReportHandler,
  getWeeklyReportHandler,
  updatePunchHandler,
  getEmployeePunchesHandler,
} from "../controllers/admin.controller.js";

const router = Router();

router.use(verifyToken);
router.use(requireAdmin);

router.get("/employees", getEmployeesHandler);
router.get("/punches", getEmployeePunchesHandler);
router.get("/reports/daily", getDailyReportHandler);
router.get("/reports/weekly", getWeeklyReportHandler);
router.patch("/punch/:id", updatePunchHandler);

export default router;
