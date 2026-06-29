import { useState } from "react";
import {
  getAdminDailyReport,
  getAdminWeeklyReport,
  getEmployees,
} from "../services/api/computeService.js";

const AdminReportsPage = () => {
  const [reportType, setReportType] = useState("daily");
  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Manila",
    }),
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [report, setReport] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    setFetched(false);
    try {
      const [empList, reportData] = await Promise.all([
        getEmployees(),
        reportType === "daily"
          ? getAdminDailyReport(date)
          : getAdminWeeklyReport(startDate, endDate),
      ]);
      setEmployees(empList);
      setReport(reportData);
      setFetched(true);
    } catch (err) {
      console.error("Failed to fetch report:", err);
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeName = (userId) => {
    const emp = employees.find((e) => e.id === userId);
    return emp?.name || userId;
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
        <h1 className="text-3xl text-black/70 font-bold">Reports</h1>
        <p className="text-gray-400 mt-1">
          Daily and weekly attendance reports
        </p>
      </div>

      <div className="bg-white rounded-xl p-5 mb-6 border border-gray-500/40">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-gray-400 text-sm mb-1">
              Report Type
            </label>
            <div className="flex rounded-lg overflow-hidden border border-gray-700">
              <button
                onClick={() => setReportType("daily")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  reportType === "daily"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setReportType("weekly")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  reportType === "weekly"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                Weekly
              </button>
            </div>
          </div>

          {reportType === "daily" ? (
            <div>
              <label className="block text-gray-400 text-sm mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </>
          )}

          <button
            onClick={fetchReport}
            disabled={loading}
            className="bg-green-600 hover:bg-green-900 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg transition-colors text-sm"
          >
            {loading ? "Loading..." : "Generate Report"}
          </button>
        </div>
      </div>

      {fetched &&
        (report.length === 0 ? (
          <div className="bg-white border border-gray-500/40 rounded-xl p-6 text-center text-black">
            No data found for the selected period.
          </div>
        ) : (
          <div className="bg-white border border-gray-500/40 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800">
                  <th className="text-left px-4 py-3">Employee</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Punch In</th>
                  <th className="text-left px-4 py-3">Punch Out</th>
                  <th className="text-left px-4 py-3">Regular</th>
                  <th className="text-left px-4 py-3">OT</th>
                  <th className="text-left px-4 py-3">ND</th>
                  <th className="text-left px-4 py-3">Late</th>
                  <th className="text-left px-4 py-3">UT</th>
                </tr>
              </thead>
              <tbody>
                {report.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-800 hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-3 text-gray-500 font-medium">
                      {getEmployeeName(row.userId)}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{row.date}</td>
                    <td className="px-4 py-3 text-green-400">{row.punchIn}</td>
                    <td className="px-4 py-3 text-red-400">{row.punchOut}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {row.regularHours}h
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {row.overtimeHours}h
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {row.nightDifferentialHours}h
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {formatMinutes(row.lateMinutes)}
                    </td>
                    <td className="px-4 py-3 text-red-500">
                      {formatMinutes(row.undertimeMinutes)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
};

export default AdminReportsPage;
