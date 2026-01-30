import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import * as AuthService from "../../services/authService";

const Login: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    if (!userName || !password) {
      setError("User Name and Password are required");
      return;
    }

    try {
      setLoading(true);
      const response = await AuthService.login(userName, password);

      login(
        response.token,
        response.role,
        response.userName,
        response.employeeId,
        response.employeeName
      );

      navigate(
        response.role === "Employee"
          ? "/employee-dashboard"
          : "/manager-dashboard"
      );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" height="100vh" flexDirection={{ xs: "column", md: "row" }}>
      {/* Background with overlay */}
      <Box
        flex={1}
        sx={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/assets/image1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Login Card */}
      <Box flex={1} display="flex" justifyContent="center" alignItems="center" p={3}>
        <Card sx={{ width: "100%", maxWidth: 400 }}>
          <CardContent>
            <Typography
              variant="h5"
              textAlign="center"
              mb={2}
              color="primary"
              sx={{ fontWeight: 600 }}
            >
              Welcome to Accenture
            </Typography>
            <Typography
              variant="body2"
              textAlign="center"
              color="text.secondary"
              mb={3}
            >
              Sign in to continue to your dashboard
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                margin="normal"
                label="User Name"
                variant="outlined"
                value={userName}
                autoComplete="off"
                onChange={(e) => {
                  setUserName(e.target.value);
                  if (error) setError("");
                }}
              />

              <TextField
                fullWidth
                margin="normal"
                type={showPassword ? "text" : "password"}
                label="Password"
                variant="outlined"
                value={password}
                autoComplete="new-password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 2 }}
                type="submit"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Login;