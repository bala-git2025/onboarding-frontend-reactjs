import React from "react";
import styles from "../styles/Header.module.css";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>Accenture</div>
      <nav className={styles.nav}>
        {/* Example navigation links */}
        <a href="/">Home</a>
        <a href="/employee-dashboard">Employee</a>
        <a href="/manager-dashboard">Manager</a>
      </nav>
    </header>
  );
};

export default Header;