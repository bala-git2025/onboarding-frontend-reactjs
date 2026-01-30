import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

interface Props {
  children: React.ReactNode;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const MainLayout: React.FC<Props> = ({ children, darkMode, toggleDarkMode }) => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      sx={{ backgroundColor: theme.palette.background.default }}
    >
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Box
        component="main"
        flexGrow={1}
        sx={{
          p: theme.spacing(2),
          overflow: "auto",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {children}
      </Box>

      <Footer />
    </Box>
  );
};

export default MainLayout;