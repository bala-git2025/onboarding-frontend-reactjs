import React from "react";
import styles from "../styles/Header.module.css";
import { useAuth } from "../context/AuthContext";

const Header: React.FC = () => {
  const { logout, role } = useAuth();
  return (
    <header className={styles.header}>
      <div className={styles.logo}>Onboarding System</div>
       <nav className={styles.nav}>
        {role === "Employee" && <a href="/employee-dashboard">Dashboard</a>}
        {role === "Manager" && <a href="/manager-dashboard">Dashboard</a>}
        {role && (
          <button onClick={logout} className={styles.logoutBtn}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;