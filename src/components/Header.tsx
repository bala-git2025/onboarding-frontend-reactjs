import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  const { logout, role, userName } = useAuth();

  const brandText =
    role === "Employee"
      ? "Employee Dashboard"
      : role === "Manager"
      ? "Manager Dashboard"
      : "Onboarding System";

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={1}
      sx={{ top: 0, zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight="bold">
          {brandText}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={toggleDarkMode} color="inherit" sx={{ mr: 2 }}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {role && (
            <>
              <AccountCircle sx={{ mr: 1 }} />
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                Welcome, {userName}
              </Typography>
              <Button onClick={logout} variant="outlined" color="error" size="small">
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;