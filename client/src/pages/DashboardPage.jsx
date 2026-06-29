import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getDailySummary,
  getWeeklySummary,
} from "../services/api/computeService.js";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/firebase/authService.js";

const KPICard = ({ label, value, unit, color }) => (
  <div className={`bg-white rounded-xl p-5 border ${color}`}>
    <p className="text-gray-500 text-sm mb-1">{label}</p>
    <p className="text-2xl font-bold text-gray-600">
      {value} <span className="text-sm font-normal text-gray-600">{unit}</span>
    </p>
  </div>
);

const DashboardPage = () => {
  const { userProfile, currentUser } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];

        const startDate = new Date();
        startDate.setDate(today.getDate() - 6);
        const startStr = startDate.toISOString().split("T")[0];

        const [dailyData, weeklyData] = await Promise.all([
          getDailySummary(todayStr).catch(() => null),
          getWeeklySummary(startStr, todayStr).catch(() => []),
        ]);

        setSummary(dailyData);
        setWeekly(weeklyData);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const formatMinutes = (mins) => {
    if (!mins) return "0m";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="min-h-screen bg-white text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl text-black/70 font-bold">Dashboard</h1>
            <p className="text-gray-400 mt-1">
              Welcome back, {userProfile?.name || "Employee"}
            </p>
          </div>
        </div>

        {loading && (
          <div className="text-center text-gray-400 py-20">Loading...</div>
        )}

        {!loading && (
          <>
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-500 mb-4">
                Today's Summary
              </h2>

              {!summary ? (
                <div className="bg-white border border-gray-500/40 rounded-xl p-6 text-center text-gray-500">
                  No attendance data for today yet. Punch in to get started.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <KPICard
                    label="Regular Hours"
                    value={summary.regularHours ?? 0}
                    unit="hrs"
                    color="border-gray-500/40"
                  />
                  <KPICard
                    label="Overtime"
                    value={summary.overtimeHours ?? 0}
                    unit="hrs"
                    color="border-gray-500/40"
                  />
                  <KPICard
                    label="Night Differential"
                    value={summary.nightDifferentialHours ?? 0}
                    unit="hrs"
                    color="border-gray-500/40"
                  />
                  <KPICard
                    label="Late"
                    value={formatMinutes(summary.lateMinutes)}
                    unit=""
                    color="border-gray-500/40"
                  />
                  <KPICard
                    label="Undertime"
                    value={formatMinutes(summary.undertimeMinutes)}
                    unit=""
                    color="border-gray-500/40"
                  />
                  <KPICard
                    label="Punch In"
                    value={summary.punchIn ?? "--"}
                    unit=""
                    color="border-gray-500/40"
                  />
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-500 mb-4">
                Weekly History
              </h2>

              {weekly.length === 0 ? (
                <div className="bg-white border border-gray-500/40 rounded-xl p-6 text-center text-gray-500">
                  No weekly data available yet.
                </div>
              ) : (
                <div className="bg-gray-900 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-800">
                        <th className="text-left px-4 py-3">Date</th>
                        <th className="text-left px-4 py-3">Punch In</th>
                        <th className="text-left px-4 py-3">Punch Out</th>
                        <th className="text-left px-4 py-3">Regular</th>
                        <th className="text-left px-4 py-3">OT</th>
                        <th className="text-left px-4 py-3">Late</th>
                        <th className="text-left px-4 py-3">UT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weekly.map((day) => (
                        <tr
                          key={day.id}
                          className="border-b border-gray-500/40"
                        >
                          <td className="px-4 py-3 text-gray-500">
                            {day.date}
                          </td>
                          <td className="px-4 py-3 text-green-400">
                            {day.punchIn}
                          </td>
                          <td className="px-4 py-3 text-red-400">
                            {day.punchOut}
                          </td>
                          <td className="px-4 py-3">{day.regularHours}h</td>
                          <td className="px-4 py-3 text-gray-500">
                            {day.overtimeHours}h
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {formatMinutes(day.lateMinutes)}
                          </td>
                          <td className="px-4 py-3 text-red-500">
                            {formatMinutes(day.undertimeMinutes)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
