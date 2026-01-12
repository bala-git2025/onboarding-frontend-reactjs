import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  token: string | null;
  role: string | null;
  login: (token: string, role: string, rememberMe: boolean) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    const storedRole = localStorage.getItem("role") || sessionStorage.getItem("role");

    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);

      if (storedRole === "Employee") {
        navigate("/employee-dashboard", { replace: true });
      } else if (storedRole === "Manager") {
        navigate("/manager-dashboard", { replace: true });
      }
    }
    setLoading(false);
  }, [navigate]);

  const login = (newToken: string, newRole: string, rememberMe: boolean) => {
    setToken(newToken);
    setRole(newRole);

    if (rememberMe) {
      localStorage.setItem("token", newToken);
      localStorage.setItem("role", newRole);
    } else {
      sessionStorage.setItem("token", newToken);
      sessionStorage.setItem("role", newRole);
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.clear();
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};