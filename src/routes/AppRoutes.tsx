import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login/Login";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import TeamDashboard from "../pages/manager/TeamDashBoard";
import ProtectedRoute from "./ProtectedRoute";
import TaskDetail from "../pages/employee/TaskDetail";
 
const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Login />} />
 
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
        <ProtectedRoute allowedRole={["Employee"]}>
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

    
    <Route path="*" element={<Login />} />
  </Routes>
);
 
export default AppRoutes;