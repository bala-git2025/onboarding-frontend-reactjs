import React from "react";
import MainLayout from "../../layouts/MainLayout";
import styles from "../../styles/EmployeeDashboard.module.css";

const EmployeeDashboard: React.FC = () => {
  return (
    <MainLayout>
      <div className={styles.dashboard}>
        <h2>Employee Dashboard</h2>
        <p>Welcome to your dashboard. Here you can view tasks, updates, and notifications.</p>
      </div>
    </MainLayout>
  );
};

export default EmployeeDashboard;