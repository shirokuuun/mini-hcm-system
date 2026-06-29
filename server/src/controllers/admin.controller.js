import {
  getAllEmployees,
  getDailyReport,
  getWeeklyReport,
  updatePunch,
  getEmployeePunches,
} from "../services/adminService.js";
import { computeAndSaveSummary } from "../services/attendanceService.js";
import { db } from "../config/firebaseAdmin.js";
import { getTodayDate } from "../utils/timeHelpers.js";

// Returns all employees

export const getEmployeesHandler = async (req, res) => {
  try {
    const employees = await getAllEmployees();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Returns daily summary reports for all employees

export const getDailyReportHandler = async (req, res) => {
  try {
    const date = req.query.date || getTodayDate();
    const report = await getDailyReport(date);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Returns weekly report for all employees

export const getWeeklyReportHandler = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "startDate and endDate are required" });
    }

    const report = await getWeeklyReport(startDate, endDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Updates a punch document (admin)

export const updatePunchHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const result = await updatePunch(punchId, updates);

    const punchDoc = await db.collection("attendance").doc(punchId).get();
    const { userId, date } = punchDoc.data();
    const userDoc = await db.collection("users").doc(userId).get();
    const schedule = userDoc.data()?.schedule;

    if (schedule) {
      await computeAndSaveSummary(userId, schedule, date);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Returns punches for a specific employee on a date

export const getEmployeePunchesHandler = async (req, res) => {
  try {
    const { userId, date } = req.query;

    if (!userId) {
      res.status(400).json({ error: "userId is required" });
    }

    const targetDate = date || getTodayDate();
    const punches = await getEmployeePunches(userId, targetDate);
    res.json(punches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
