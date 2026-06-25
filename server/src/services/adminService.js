import { db } from "../config/firebaseAdmin.js";

// Fetches all employees that has a role of an "employee"

export const getAllEmployees = async () => {
  const snapshot = await db
    .collection("users")
    .where("role", "==", "employee")
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Fetches all daily summaries for all employees on a specific date

export const getDailyReport = async (date) => {
  const snapshot = await db
    .collection("dailySummary")
    .where("date", "==", date)
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Fetches weekly summaries for all employees

export const getWeeklyReport = async (startDate, endDate) => {
  const snapshot = await db
    .collection("dailySummary")
    .where("date", ">=", startDate)
    .where("date", "<=", endDate)
    .orderBy("date", "asc")
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Updates a punch document (admin edit)

export const updatePunch = async (punchId, updates) => {
  const ref = db.collection("attendance").doc(punchId);
  const doc = await ref.get();

  if (!doc.exists) {
    throw new Error(`Punch ${punchId} not found.`);
  }

  const updatedData = {
    ...updates,
    updatedAt: new Date(),
    updatedBy: "admin",
  };

  await ref.update(updatedData);

  return { id: punchId, ...doc.data(), ...updatedData };
};

// Fetches all punches for a specific employee on a date (admin view)

export const getEmployeePunches = async (userId, date) => {
  const snapshot = await db
    .collection("attendance")
    .where("userId", "==", userId)
    .where("date", "==", date)
    .orderBy("timestamp", "asc")
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
