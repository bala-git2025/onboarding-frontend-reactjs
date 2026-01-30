import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/login/Login";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import TeamDashboard from "../pages/manager/teamDashBoard";
import ProtectedRoute from "./ProtectedRoute";
import TaskDetail from "../pages/employee/TaskDetail";
import Employee from "../pages/manager/EmployeeDetail";
import AddTask from "../pages/manager/AddTask";
 
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
        <ProtectedRoute allowedRole={["Employee","Manager"]}>
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
    <Route path="*" element={<Login />} />
  </Routes>
);
 
export default AppRoutes;