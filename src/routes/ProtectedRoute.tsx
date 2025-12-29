import { Navigate } from "react-router-dom";
import type { JSX } from "react/jsx-runtime";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = sessionStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
