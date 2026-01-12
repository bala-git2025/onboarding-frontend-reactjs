// src/pages/manager/ManagerDashboard.tsx
import React from "react";
import MainLayout from "../../layouts/MainLayout";
import styles from "../../styles/ManagerDashboard.module.css";

const ManagerDashboard: React.FC = () => {
  return (
    <MainLayout>
      <div className={styles.dashboard}>
        <h2>Manager Dashboard</h2>
        <p>Welcome to your dashboard. Here you can oversee employees, assign tasks, and review reports.</p>
      </div>
    </MainLayout>
  );
};

export default ManagerDashboard;