import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "./layouts/MainLayout";
import { lightTheme, darkTheme } from "./theme";
import { useAuth } from "./context/AuthContext";
import LoadingSpinner from "./components/LoadingSpinner";
import AppRoutes from "./routes/AppRoutes";

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { loading } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === "dark") setDarkMode(true);
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  if (loading) {
    return (
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <LoadingSpinner />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
        <AppRoutes />
      </MainLayout>
    </ThemeProvider>
  );
};

export default App;