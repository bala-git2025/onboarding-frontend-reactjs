import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: Array<"Employee" | "Manager">;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { token, role } = useAuth() as { token: string | null; role: "Employee" | "Manager" | null };

  if (!token) return <Navigate to="/" replace />;

 if (!role || !allowedRole.includes(role)) {
    return role === "Employee"
      ? <Navigate to="/employee-dashboard" replace />
      : <Navigate to="/manager-dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;