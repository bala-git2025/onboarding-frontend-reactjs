import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  token: string | null;
  role: string | null;
  userName: string | null;
  employeeId: number | null;
  employeeName: string | null;
  login: (token: string, role: string, rememberMe: boolean, userName: string, employeeId: number, employeeName?: string) => void;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [employeeName, setEmployeeName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    const storedRole = localStorage.getItem("role") || sessionStorage.getItem("role");
    const storedUser = localStorage.getItem("userName") || sessionStorage.getItem("userName");
    const storedEmpId = localStorage.getItem("employeeId") || sessionStorage.getItem("employeeId");
    const storedEmpName = localStorage.getItem("employeeName") || sessionStorage.getItem("employeeName");

    if (storedToken && storedRole && storedUser && storedEmpId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(storedToken);
      setRole(storedRole);
      setUserName(storedUser);
      setEmployeeId(Number(storedEmpId));
      setEmployeeName(storedEmpName);
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newRole: string, rememberMe: boolean, newUserName: string, newEmployeeId: number, newEmployeeName?: string) => {
    setToken(newToken);
    setRole(newRole);
    setUserName(newUserName);
    setEmployeeId(newEmployeeId);
    setEmployeeName(newEmployeeName || null);

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("token", newToken);
    storage.setItem("role", newRole);
    storage.setItem("userName", newUserName);
    storage.setItem("employeeId", String(newEmployeeId));
    if (newEmployeeName) {
      storage.setItem("employeeName", newEmployeeName);
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUserName(null);
    setEmployeeId(null);
    setEmployeeName(null);
    localStorage.clear();
    sessionStorage.clear();
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ token, role, userName, employeeId, employeeName, login, logout, loading, isAuthenticated }}
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