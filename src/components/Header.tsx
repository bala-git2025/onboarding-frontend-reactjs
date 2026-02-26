import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  const { logout, role, userName, employeeName } = useAuth();
  const navigate = useNavigate();

  const brandText =
    role === "Employee"
      ? "Employee Dashboard"
      : role === "Manager"
      ? "Manager Dashboard"
      : "Onboarding System";

  const brandRoute =
    role === "Employee"
      ? "/employee-dashboard"
      : role === "Manager"
      ? "/manager-dashboard"
      : "/";

  const displayName = employeeName || userName || "Guest";

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={2}
      sx={{ top: 0, zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        {/* Brand text */}
        <Typography
          variant="h6"
          component="h1"
          sx={{
            fontWeight: 700,
            cursor: "pointer",
            flexGrow: 1,
          }}
          onClick={() => navigate(brandRoute)}
        >
          {brandText}
        </Typography>

        {/* Dark mode toggle */}
        <Tooltip
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <IconButton
            onClick={toggleDarkMode}
            color="inherit"
            sx={{ mr: 2 }}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>

        {/* User menu */}
        {role && (
          <>
            <Tooltip title="Account Menu">
              <IconButton
                onClick={handleMenu}
                color="inherit"
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                aria-label="Account menu"
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>

            <Menu
              id="account-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              transformOrigin={{
                horizontal: "right",
                vertical: "top",
              }}
              anchorOrigin={{
                horizontal: "right",
                vertical: "bottom",
              }}
              PaperProps={{
                elevation: 4,
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                },
              }}
            >
              <MenuItem disabled>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "#008080" }}
                >
                  Welcome, {displayName}
                </Typography>
              </MenuItem>

              <Divider />
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/profile");
                }}
              >
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  logout();
                  navigate("/", { replace: true });
                }}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;