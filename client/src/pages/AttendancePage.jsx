import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  punchIn,
  punchOut,
  getPunchStatus,
} from "../services/api/computeService.js";

const AttendancePage = () => {
  const { userProfile } = useAuth();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getPunchStatus();
        console.log("Punch status response:", data);
        setStatus(data.status);
      } catch (err) {
        console.error("Failed to fetch status.", err);
      }
    };
    fetchStatus();
  }, []);

  const handlePunch = async (type) => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const data = type === "in" ? await punchIn() : await punchOut();
      setStatus(type);
      setMessage(
        type === "in"
          ? "Successfully punched in!"
          : "Successfully punched out! Summary has been computed.",
      );
    } catch (err) {
      console.error("Full error:", err); // ← add this
      console.error("Response data:", err.response?.data); // ← and this
      setError(
        err.response?.data?.error || err.message || "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-PH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-10">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Time Attendance</h1>
          <p className="text-gray-400 mt-1">
            Welcome, {userProfile?.name || "Employee"}
          </p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 text-center mb-6">
          <p className="text-gray-400 text-sm mb-1">
            {formatDate(currentTime)}
          </p>
          <p className="text-5xl font-bold text-white tracking-widest">
            {formatTime(currentTime)}
          </p>
          <p className="text-gray-500 text-sm mt-3">
            Shift: {userProfile?.schedule?.start} - {userProfile?.schedule?.end}
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
              status === "in"
                ? "bg-green-500/20 text-green-400 border border-green-500"
                : status === "out"
                  ? "bg-red-500/20 text-red-400 border border-red-500"
                  : "bg-gray-700 text-gray-400"
            }`}
          >
            {status === "in"
              ? "Currently Punched In"
              : status === "out"
                ? "Punched Out"
                : "Not yet punched in"}
          </span>
        </div>

        {message && (
          <div className="mb-4 bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-sm text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handlePunch("in")}
            disabled={loading || status === "in"}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors text-lg"
          >
            {loading ? "..." : "Punch In"}
          </button>
          <button
            onClick={() => handlePunch("out")}
            disabled={loading || status === "out" || status === null}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors text-lg"
          >
            {loading ? "..." : "Punch Out"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
