import React, { useState } from "react";
import { login as loginApi } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import styles from "../../styles/Login.module.css";
import { useAuth } from "../../context/AuthContext";

const Login: React.FC = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const EMPLOYEE_USER = "employee123";
  const EMPLOYEE_PASS = "password123";
  const MANAGER_USER = "manager123";
  const MANAGER_PASS = "password123";

  const handleLogin = async () => {
    // ✅ Required field validation 
    if (!employeeId || !password) { 
      setError("Employee ID and Password are required"); 
      return; 
    }
    
    let role: "Employee" | "Manager" | null = null;
    if (employeeId === EMPLOYEE_USER && password === EMPLOYEE_PASS) {
      role = "Employee";
    } else if (employeeId === MANAGER_USER && password === MANAGER_PASS) {
      role = "Manager";
    }
    if (role) {
      const fakeToken = "test-token-123";
      login(fakeToken, role, rememberMe);
      if (role === "Employee") {
        navigate("/employee-dashboard");
      } else {
        navigate("/manager-dashboard");
      }
    } else {
      setError("Invalid username or password");
    }
  };

  /*
  const handleLogin = async () => {
    try {
      const data = await loginApi(employeeId, password);
      login(data.token, data.role, rememberMe);

      if (data.role === "Employee") {
        navigate("/employee-dashboard");
      } else {
        navigate("/manager-dashboard");
      }
    } catch {
      setError("Invalid username or password");
    }
  }; */

  return (
    <MainLayout>
      {" "}
      <div className={styles.loginContainer}>
        {" "}
        <div className={styles.imageSection}>
          {" "}
          <img
            src="/assets/image1.jpg"
            alt="Onboarding illustration"
          />{" "}
        </div>{" "}
        <div className={styles.formSection}>
          {" "}
          <div className={styles.loginBox}>
            {" "}
            <h2>Sign In</h2> {/* Error message */}{" "}
            {error && <div className={styles.error}>{error}</div>}{" "}
            <input
              type="text"
              placeholder="Enter your employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />{" "}
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />{" "}
            {/* Checkbox row */}{" "}
            <div className={styles.checkboxRow}>
              {" "}
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />{" "}
              <label htmlFor="rememberMe">Remember me</label>{" "}
            </div>{" "}
            <button onClick={handleLogin}>Sign In</button>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </MainLayout>
  );
};
export default Login;