import { createTheme } from "@mui/material/styles";

const sharedOptions = {
  typography: {
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
          transition:
            "background-color 0.4s ease, color 0.4s ease, transform 0.2s ease",
          "&:hover": { transform: "scale(1.05)" },
          "&:active": { transform: "scale(0.95)" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
          transition: "background-color 0.4s ease, color 0.4s ease",
        },
      },
    },
  },
};

const sharedPalette = {
  accent: { main: "#008080" },
  task: { main: "#1976d2" },
  login: { main: "#673ab7" },
  success: { main: "#2e7d32" },
  warning: { main: "#ed6c02" },
  info: { main: "#0288d1" },
  secondary: { main: "#9c27b0" },
};

const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: { default: "#ffffff", paper: "#ffffff" },
    text: { primary: "#333", secondary: "#555" },
    action: {
      hover: "rgba(0,0,0,0.04)",
      active: "#333",
      selected: "rgba(0,0,0,0.08)",
      disabled: "rgba(0,0,0,0.26)",
      disabledBackground: "rgba(0,0,0,0.12)",
    },
    ...sharedPalette,
  },
  ...sharedOptions,
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#121212", paper: "#1e1e1e" },
    text: { primary: "#e0e0e0", secondary: "#b0b0b0" },
    action: {
      hover: "rgba(255,255,255,0.08)",
      active: "#fff",
      selected: "rgba(255,255,255,0.16)",
      disabled: "rgba(255,255,255,0.3)",
      disabledBackground: "rgba(255,255,255,0.12)",
    },
    ...sharedPalette,
  },
  ...sharedOptions,
});

export { lightTheme, darkTheme };