import {
  savePunch,
  getLatestPunch,
  getPunchesByDate,
  getDailySummary,
  getWeeklySummary,
  computeAndSaveSummary,
} from "../services/attendanceService.js";
import { db } from "../config/firebaseAdmin.js";
import { getTodayDate } from "../utils/timeHelpers.js";

// Returns the latest punch status for the logged-in user

export const getStatusHandler = async (req, res) => {
  try {
    const latest = await getLatestPunch(req.user.uid);
    res.json({
      status: latest ? latest.type : null,
      lastPunch: latest || null,
    });
  } catch (error) {
    res.status(500).json({
      error: "error.message",
    });
  }
};

// Saves a punch in or out for the logged-in user

export const punchHandler = async (req, res) => {
  try {
    const { type } = req.body;
    const userId = req.user.uid;

    if (!type || !["in", "out"].includes(type)) {
      return res.status(400).json({ error: "type must be 'in' or 'out'" });
    }

    const latest = await getLatestPunch(userId);
    if (latest && latest.type === type) {
      return res.status(400).json({
        error: `Already punched ${type} today`,
      });
    }

    const punch = await savePunch(userId, type);

    if (type === "out") {
      const userDoc = await db.collection("users").doc(userId).get();
      const schedule = userDoc.data()?.schedule;

      if (!schedule) {
        res.status(400).json({
          error: "User schedule not found.",
        });
      }

      const summary = await computeAndSaveSummary(userId, schedule);
      return res.json({
        punch,
        summary,
      });

      res.json({ punch });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Returns daily summary for the logged-in user

export const getDailySummaryHandler = async (req, res) => {
  try {
    const date = req.query.date || getTodayDate();
    const summary = await getDailySummary(req.user.uid, date);

    if (!summary) {
      res.status(404).json({ error: "No summary found for this date" });
    }

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Returns weekly summaries for the logged-in user

export const getWeeklySummaryHandler = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ error: "startDate and endDate are required" });
    }

    const summaries = await getWeeklySummary(req.user.uid, startDate, endDate);
    res.json(summaries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Returns raw punches for the logged-in user on a date

export const getPunchesHandler = async (req, res) => {
  try {
    const date = req.query.date || getTodayDate();
    const punches = await getPunchesByDate(req.user.uid, date);
    res.json(punches);
  } catch (error) {
    res.json(500).json({ error: error.message });
  }
};
