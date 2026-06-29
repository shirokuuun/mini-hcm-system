import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AttendancePage from "./pages/AttendancePage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import AdminReportsPage from "./pages/AdminReportsPage.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoutes.jsx";
import Layout from "./components/layout/Layout.jsx";

const App = () => {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/*Public path anyone can access*/}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/*Protected path authorized users can access*/}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
        </Route>
      </Route>

      {/*Admin only path*/}
      <Route element={<ProtectedRoute adminOnly />}>
        <Route element={<Layout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
        </Route>
      </Route>

      {/*Default redirect*/}
      <Route
        path="/"
        element={
          currentUser ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
