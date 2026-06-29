import { useState, useEffect } from "react";
import {
  getEmployees,
  getAdminDailyReport,
  getEmployeePunches,
  updatePunch,
} from "../services/api/computeService.js";

const AdminDashboardPage = () => {
  const [employees, setEmployees] = useState([]);
  const [report, setReport] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Manila",
    }),
  );
  const [loading, setLoading] = useState(true);
  const [punches, setPunches] = useState({});
  const [editingPunch, setEditingPunch] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [employeeList, dailyReport] = await Promise.all([
        getEmployees(),
        getAdminDailyReport(selectedDate),
      ]);
      setEmployees(employeeList);
      setReport(dailyReport);

      const punchMap = {};
      await Promise.all(
        dailyReport.map(async (row) => {
          const empPunches = await getEmployeePunches(row.userId, selectedDate);
          punchMap[row.userId] = empPunches;
        }),
      );
      setPunches(punchMap);
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeName = (userId) => {
    const emp = employees.find((e) => e.id === userId);
    return emp?.name || userId;
  };

  const handleEditPunch = (punch) => {
    setEditingPunch(punch);
    const date = punch.timestamp?.toDate
      ? punch.timestamp.toDate()
      : new Date(punch.timestamp);
    const time = date.toLocaleTimeString("en-PH", {
      timeZone: "Asia/Manila",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    setEditValue(time);
  };

  const handleSavePunch = async () => {
    if (!editingPunch) return;
    setSaving(true);
    try {
      const [hours, minutes] = editValue.split(":").map(Number);

      const [year, month, day] = selectedDate.split("-").map(Number);
      const manilaDateStr = `${selectedDate}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00+08:00`;
      const newTimestamp = new Date(manilaDateStr);

      await updatePunch(editingPunch.id, { timestamp: newTimestamp });
      setMessage("Punch updated successfully.");
      setEditingPunch(null);
      fetchData();
    } catch (err) {
      setMessage("Failed to update punch.");
    } finally {
      setSaving(false);
    }
  };

  const formatMinutes = (mins) => {
    if (!mins) return "0m";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="text-white px-6 py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl text-black/70 font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Employee attendance overview</p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <label className="text-gray-500 text-sm">Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-white text-gray-500 border border-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      {message && (
        <div className="mb-4 bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-sm">
          {message}
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-400 py-20">Loading...</div>
      ) : (
        <>
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-gray-500 mb-4">
              Daily Report — {selectedDate}
            </h2>

            {report.length === 0 ? (
              <div className="bg-white text-gray-500 border border-gray-500 rounded-xl p-6 text-center">
                No attendance data for this date.
              </div>
            ) : (
              <div className="bg-white text-gray-500 border border-gray-500 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-800">
                      <th className="text-left px-4 py-3">Employee</th>
                      <th className="text-left px-4 py-3">Punch In</th>
                      <th className="text-left px-4 py-3">Punch Out</th>
                      <th className="text-left px-4 py-3">Regular</th>
                      <th className="text-left px-4 py-3">OT</th>
                      <th className="text-left px-4 py-3">ND</th>
                      <th className="text-left px-4 py-3">Late</th>
                      <th className="text-left px-4 py-3">UT</th>
                      <th className="text-left px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.map((row) => (
                      <tr key={row.id} className="border-b border-gray-800">
                        <td className="px-4 py-3 text-gray-500 font-medium">
                          {getEmployeeName(row.userId)}
                        </td>
                        <td className="px-4 py-3 text-green-400">
                          {row.punchIn}
                        </td>
                        <td className="px-4 py-3 text-red-400">
                          {row.punchOut}
                        </td>
                        <td className="px-4 py-3">{row.regularHours}h</td>
                        <td className="px-4 py-3">{row.overtimeHours}h</td>
                        <td className="px-4 py-3 0">
                          {row.nightDifferentialHours}h
                        </td>
                        <td className="px-4 py-3 ">
                          {formatMinutes(row.lateMinutes)}
                        </td>
                        <td className="px-4 py-3 text-red-500 ">
                          {formatMinutes(row.undertimeMinutes)}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {(() => {
                              const userPunches = punches[row.userId] || [];
                              const firstPunchIn = userPunches.find(
                                (p) => p.type === "in",
                              );
                              const lastPunchOut = [...userPunches]
                                .reverse()
                                .find((p) => p.type === "out");
                              return (
                                <>
                                  {firstPunchIn && (
                                    <button
                                      onClick={() =>
                                        handleEditPunch(firstPunchIn)
                                      }
                                      className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs transition-colors"
                                    >
                                      Edit In
                                    </button>
                                  )}
                                  {lastPunchOut && (
                                    <button
                                      onClick={() =>
                                        handleEditPunch(lastPunchOut)
                                      }
                                      className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs transition-colors"
                                    >
                                      Edit Out
                                    </button>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-500 mb-4">
              Employees
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employees.map((emp) => (
                <div
                  key={emp.id}
                  className="bg-white text-gray-500 border border-gray-500 rounded-xl p-5 "
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-700 font-semibold">{emp.name}</p>
                      <p className="text-gray-500 text-sm">{emp.email}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        Shift: {emp.schedule?.start} – {emp.schedule?.end}
                      </p>
                    </div>
                    <span className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-500 px-2 py-1 rounded text-xs">
                      {emp.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {editingPunch && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm border border-gray-700">
            <h3 className="text-white font-bold text-lg mb-4">Edit Punch</h3>
            <p className="text-gray-400 text-sm mb-4">
              Type:{" "}
              <span className="text-white capitalize">{editingPunch.type}</span>
            </p>
            <label className="block text-gray-400 text-sm mb-1">New Time</label>
            <input
              type="time"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleSavePunch}
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditingPunch(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
