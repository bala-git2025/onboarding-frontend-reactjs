import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress,
  Typography,
} from "@mui/material";

interface AuthContextType {
  token: string | null;
  role: string | null;
  userName: string | null;
  employeeId: number | null;
  employeeName: string | null;
  login: (
    token: string,
    role: string,
    userName: string,
    employeeId: number,
    employeeName?: string
  ) => void;
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
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60); // countdown in seconds

  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedUser = localStorage.getItem("userName");
    const storedEmpId = localStorage.getItem("employeeId");
    const storedEmpName = localStorage.getItem("employeeName");

    if (storedToken && storedRole && storedUser && storedEmpId) {
      setToken(storedToken);
      setRole(storedRole);
      setUserName(storedUser);
      setEmployeeId(Number(storedEmpId));
      setEmployeeName(storedEmpName);
    }
    setLoading(false);
  }, []);

  const clearAllTimers = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
  };

  const resetInactivityTimer = () => {
    clearAllTimers();

    // Show warning at 9 minutes
    warningTimer.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(60); // reset countdown to 60 seconds
      countdownInterval.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval.current!);
          }
          return prev - 1;
        });
      }, 1000);
    }, 9 * 60 * 1000); // corrected to 9 minutes

    // Logout at 10 minutes
    inactivityTimer.current = setTimeout(() => {
      logout();
    }, 10 * 60 * 1000);
  };

  useEffect(() => {
    if (token) {
      const events = ["mousemove", "keydown", "click", "scroll"];
      events.forEach((event) => window.addEventListener(event, resetInactivityTimer));
      resetInactivityTimer();

      return () => {
        events.forEach((event) => window.removeEventListener(event, resetInactivityTimer));
        clearAllTimers();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = (
    newToken: string,
    newRole: string,
    newUserName: string,
    newEmployeeId: number,
    newEmployeeName?: string
  ) => {
    setToken(newToken);
    setRole(newRole);
    setUserName(newUserName);
    setEmployeeId(newEmployeeId);
    setEmployeeName(newEmployeeName || null);

    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    localStorage.setItem("userName", newUserName);
    localStorage.setItem("employeeId", String(newEmployeeId));
    if (newEmployeeName) {
      localStorage.setItem("employeeName", newEmployeeName);
    }

    resetInactivityTimer();
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUserName(null);
    setEmployeeId(null);
    setEmployeeName(null);
    localStorage.clear();
    clearAllTimers();
    setShowWarning(false);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        userName,
        employeeId,
        employeeName,
        login,
        logout,
        loading,
        isAuthenticated,
      }}
    >
      {children}

      <Dialog
        open={showWarning}
        onClose={() => setShowWarning(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            minWidth: 350,
            boxShadow: 6,
          },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: "bold", textAlign: "center", color: "primary.main" }}
        >
          ⚠️ Session Expiring Soon
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You will be logged out in <strong>{countdown}</strong> seconds due to
            inactivity.
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(countdown / 60) * 100}
            sx={{ height: 8, borderRadius: 5 }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, mt: 2 }}>
          <Button
            onClick={() => {
              setShowWarning(false);
              resetInactivityTimer(); // extend session
            }}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Stay Logged In
          </Button>
          <Button
            onClick={logout}
            variant="outlined"
            color="secondary"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Logout Now
          </Button>
        </DialogActions>
      </Dialog>
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};