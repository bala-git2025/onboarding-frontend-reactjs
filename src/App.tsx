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
    if (saved === "dark") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const theme = darkMode ? darkTheme : lightTheme;

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoadingSpinner />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
        <AppRoutes />
      </MainLayout>
    </ThemeProvider>
  );
};

export default App;