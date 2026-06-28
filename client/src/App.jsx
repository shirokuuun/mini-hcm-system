import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AttendancePage from "./pages/AttendancePage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoutes.jsx";

const App = () => {
  const { currentUser, isAdmin } = useAuth();

  return (
    <Routes>
      {/*Public path anyone can access*/}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/*Protected path authorized users can access*/}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
      </Route>

      {/*Admin only path*/}
      <Route element={<ProtectedRoute adminOnly />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Route>

      {/*Default redirect*/}
      <Route
        path="/"
        element={
          currentUser ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        }
      />
    </Routes>
  );
};

export default App;
