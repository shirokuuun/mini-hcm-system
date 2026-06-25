import { db } from "../config/firebaseAdmin.js";
import { computeFromFirestorePunches } from "./computeService.js";
import { getTodayDate } from "../utils/timeHelpers.js";

// Records a punch in Firestore

export const savePunch = async (userId, type) => {
  const timestamp = new Date();
  const date = getTodayDate();

  const punch = {
    userId,
    type,
    timestamp,
    date,
    createdAt: timestamp,
  };

  const docRef = await db.collection("attendance").add(punch);

  return { id: docRef.id, ...punch };
};

// Fetches all punches for a user on a specific date

export const getPunchesByDate = async (userId, date) => {
  const snapshot = await db
    .collection("attendance")
    .where("userId", "==", userId)
    .where("date", "==", date)
    .orderBy("timestamp", "asc")
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Fetches the latest punch in or out for a user today

export const getLatestPunch = async (userId) => {
  const date = getTodayDate();

  const snapshot = await db
    .collection("attendance")
    .where("userId", "==", userId)
    .where("date", "==", date)
    .orderBy("timestamp", "asc")
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

// Saves computed daily summary to Firestore

export const saveDailySummary = async (userId, date, summary) => {
  const docId = `${userId}_${date}`;

  const data = {
    userId,
    date,
    ...summary,
    updatedAt: new Date(),
  };

  await db.collection("dailySummary").doc(docId).set(data, { merge: true });

  return { id: docId, ...data };
};

// Fetches daily summary for a user on a specific date

export const getDailySummary = async (userId, date) => {
  const docId = `${userId}_${date}`;
  const doc = await db.collection("dailySummary").doc(docId).get();

  if (!doc.exists) return null;

  return { id: docId, ...doc.data() };
};

// Fetches weekly summaries for a user

export const getWeeklySummary = async (userId, startDate, endDate) => {
  const snapshot = await db
    .collection("dailySummary")
    .where("userId", "==", userId)
    .where("date", ">=", startDate)
    .where("date", "<=", endDate)
    .orderBy("date", "asc")
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Computes and saves daily summary from today's punches

export const computeAndSaveSummary = async (userId, schedule) => {
  const date = getTodayDate();
  const punches = await getPunchesByDate(userId, date);

  const punchIn = punches.find((p) => p.type === "in");
  const punchOut = punches.find((p) => p.type === "out");

  if (!punchIn || !punchOut) {
    throw new Error(
      "Incomplete punch data - need both punch in and punch out.",
    );
  }

  const summary = computeFromFirestorePunches(punchIn, punchOut, schedule);
  const saved = await saveDailySummary(userId, date, summary);

  return saved;
};
