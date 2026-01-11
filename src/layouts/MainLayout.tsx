import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/MainLayout.module.css";

interface Props {
  children: React.ReactNode;
}

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;