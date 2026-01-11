// src/pages/Login.tsx
import React, { useState } from "react";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import styles from "../../styles/Login.module.css";

const Login: React.FC = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await login(employeeId, password);
      localStorage.setItem("token", data.token);

      if (data.role === "Employee") {
        navigate("/employee-dashboard");
      } else {
        navigate("/manager-dashboard");
      }
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <MainLayout>
      <div className={styles.loginBox}>
        <h2>Sign In</h2>
        <input
          type="text"
          placeholder="Enter your employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          &nbsp;Remember me
        </label>
        <button onClick={handleLogin}>Sign In</button>
      </div>
    </MainLayout>
  );
};

export default Login;