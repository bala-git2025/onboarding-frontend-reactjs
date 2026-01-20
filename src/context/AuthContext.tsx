import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  token: string | null;
  role: string | null;
  userName: string | null;
  login: (token: string, role: string, rememberMe: boolean, userName: string) => void;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    const storedRole = localStorage.getItem("role") || sessionStorage.getItem("role");
    const storedUser = localStorage.getItem("userName") || sessionStorage.getItem("userName");

    if (storedToken && storedRole && storedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(storedToken);
      setRole(storedRole);
      setUserName(storedUser);

      if (storedRole === "Employee") {
        navigate("/employee-dashboard", { replace: true });
      } else if (storedRole === "Manager") {
        navigate("/manager-dashboard", { replace: true });
      }
    }
    setLoading(false);
  }, [navigate]);

  const login = (newToken: string, newRole: string, rememberMe: boolean, newUserName: string) => {
    setToken(newToken);
    setRole(newRole);
    setUserName(newUserName);

    if (rememberMe) {
      localStorage.setItem("token", newToken);
      localStorage.setItem("role", newRole);
      localStorage.setItem("userName", newUserName);
    } else {
      sessionStorage.setItem("token", newToken);
      sessionStorage.setItem("role", newRole);
      sessionStorage.setItem("userName", newUserName);
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUserName(null);
    localStorage.clear();
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ token, role, userName, login, logout, loading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};