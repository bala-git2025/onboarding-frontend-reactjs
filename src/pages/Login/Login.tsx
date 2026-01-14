import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import * as AuthService from "../../services/authService";

const Login: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!userName || !password) {
      setError("User Name and Password are required");
      return;
    }

    try {
      setLoading(true);
      const response = await AuthService.login(userName, password);

      // response has { token, role, userName }
      login(response.token, response.role, rememberMe, response.userName);

      navigate(response.role === "Employee"? "/employee-dashboard": "/manager-dashboard");

    } catch (err: any) {
        setError(err.customMessage || "Something went wrong"); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" height="100%" flexDirection={{ xs: "column", md: "row" }}>
      <Box
        flex={1}
        sx={{
          backgroundImage: "url('/assets/image1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: { xs: 200, md: "auto" },
        }}
      />
      <Box flex={1} display="flex" justifyContent="center" alignItems="center" p={3}>
        <Card sx={{ width: "100%", maxWidth: 400 }}>
          <CardContent>
            <Typography variant="h5" textAlign="center" mb={2} fontWeight="bold">
              Welcome to Accenture
            </Typography>
            <Typography variant="body2" textAlign="center" color="text.secondary" mb={3}>
              Sign in to continue to your dashboard
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              fullWidth
              margin="normal"
              label="User Name"
              variant="outlined"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              type="password"
              label="Password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              }
              label="Remember me"
              sx={{ mt: 1 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Login;