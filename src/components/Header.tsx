import React from "react";
import styles from "../styles/Header.module.css";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>Onboarding System</div>
      <nav className={styles.nav}>
        {/* Example navigation links */}
        <a href="/">Home</a>
      </nav>
    </header>
  );
};

export default Header;