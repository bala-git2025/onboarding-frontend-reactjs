import { createTheme } from "@mui/material/styles";

const shared = {
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
          transition: "background-color 0.4s ease, color 0.4s ease, transform 0.2s ease",
          "&:hover": { transform: "scale(1.05)" },
          "&:active": { transform: "scale(0.9)" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: "background-color 0.4s ease, color 0.4s ease",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: "1rem",
          transition: "background-color 0.4s ease, color 0.4s ease",
        },
      },
    },
  },
};

const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: { default: "#f9f9f9" },
    text: { primary: "#333" },
  },
  ...shared,
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#121212", paper: "#1e1e1e" },
    text: { primary: "#e0e0e0" },
  },
  ...shared,
});

export { lightTheme, darkTheme };