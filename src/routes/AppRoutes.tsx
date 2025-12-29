import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login/login";
import Dashboard from "../pages/Dashboard/Dashboard";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" />} />

    <Route path="/login" element={<Login />} />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>
);

export default AppRoutes;
