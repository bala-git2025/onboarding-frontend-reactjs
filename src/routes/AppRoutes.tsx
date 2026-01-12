import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/login/Login";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Login />} />

    <Route
      path="/employee-dashboard"
      element={
        <ProtectedRoute allowedRole="Employee">
          <EmployeeDashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/manager-dashboard"
      element={
        <ProtectedRoute allowedRole="Manager">
          <ManagerDashboard />
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<Login />} />
  </Routes>
);

export default AppRoutes;