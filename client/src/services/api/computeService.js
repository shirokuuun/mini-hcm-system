import axios from "axios";
import { auth } from "../firebase/firebaseConfig.js";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = async () => {
  const token = await auth.currentUser?.getIdToken();
  return { Authorization: `Bearer ${token}` };
};

export const punchIn = async () => {
  const headers = await getAuthHeaders();
  const { data } = await axios.post(
    `${API_URL}/attendance/punch`,
    { type: "in" },
    { headers },
  );
  return data;
};

export const punchOut = async () => {
  const headers = await getAuthHeaders();
  const { data } = await axios.post(
    `${API_URL}/attendance/punch`,
    { type: "out" },
    { headers },
  );
  return data;
};

export const getPunchStatus = async () => {
  const headers = await getAuthHeaders();
  const { data } = await axios.get(`${API_URL}/attendance/status`, { headers });
  return data;
};

export const getDailySummary = async (date) => {
  const headers = await getAuthHeaders();
  const params = date ? { date } : {};
  const { data } = await axios.get(`${API_URL}/attendance/summary/daily`, {
    headers,
    params,
  });
  return data;
};

export const getWeeklySummary = async (startDate, endDate) => {
  const headers = await getAuthHeaders();
  const { data } = await axios.get(`${API_URL}/attendance/summary/weekly`, {
    headers,
    params: { startDate, endDate },
  });
  return data;
};
