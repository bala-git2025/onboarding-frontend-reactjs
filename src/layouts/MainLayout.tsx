import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Box from "@mui/material/Box";

interface Props {
  children: React.ReactNode;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const MainLayout: React.FC<Props> = ({ children, darkMode, toggleDarkMode }) => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Box component="main" flexGrow={1} sx={{ p: 2, overflow: "auto" }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;