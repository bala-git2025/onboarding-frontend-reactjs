import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? "#f5f5f5"
            : theme.palette.background.paper,
        borderTop: (theme) =>
          `1px solid ${theme.palette.divider}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {/* Left side */}
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} — Developed by Accenture
      </Typography>

      {/* Right side with links */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Link
          href="#"
          underline="hover"
          color="text.secondary"
          sx={{ "&:hover": { color: "primary.main" } }}
        >
          Privacy
        </Link>
        <Link
          href="#"
          underline="hover"
          color="text.secondary"
          sx={{ "&:hover": { color: "primary.main" } }}
        >
          Terms
        </Link>
        <Link
          href="#"
          underline="hover"
          color="text.secondary"
          sx={{ "&:hover": { color: "primary.main" } }}
        >
          Contact
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;