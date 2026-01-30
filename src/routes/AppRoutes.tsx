import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login/Login";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import TeamDashboard from "../pages/manager/teamDashBoard";
import ProtectedRoute from "./ProtectedRoute";
import TaskDetail from "../pages/employee/TaskDetail";
import Employee from "../pages/manager/EmployeeDetail";
import AddTask from "../pages/manager/AddTask";
import { useAuth } from "../context/AuthContext";
import Profile from "../pages/login/Profile";

const AppRoutes: React.FC = () => {
  const { isAuthenticated, role } = useAuth();

  return (
    <Routes>
      {/* Root route: redirect if logged in */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            role === "Employee" ? (
              <Navigate to="/employee-dashboard" replace />
            ) : role === "Manager" ? (
              <Navigate to="/manager-dashboard" replace />
            ) : (
              <Navigate to="/employee-dashboard" replace />
            )
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/employee-dashboard"
        element={
          <ProtectedRoute allowedRole={["Employee", "Manager"]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager-dashboard"
        element={
          <ProtectedRoute allowedRole={["Manager"]}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/task/:taskId"
        element={
          <ProtectedRoute allowedRole={["Employee", "Manager"]}>
            <TaskDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Team-DashBoard/id/:teamId/teamName/:teamName"
        element={
          <ProtectedRoute allowedRole={["Manager"]}>
            <TeamDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Employee/id/:employeeId"
        element={
          <ProtectedRoute allowedRole={["Manager"]}>
            <Employee />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager-dashboard/employee/:employeeId/add-task"
        element={
          <ProtectedRoute allowedRole={["Manager"]}>
            <AddTask />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRole={["Employee", "Manager"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
