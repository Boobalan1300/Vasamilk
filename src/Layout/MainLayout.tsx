


import React, { useState } from "react";
import { Layout, Grid } from "antd";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import Navbar from "./Navbar";
import styles from "./MainLayout.module.css";
import { useUserType } from "../Hooks/UserHook";

const { Content } = Layout;
const { useBreakpoint } = Grid;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed((prev) => !prev);

  const userType = useUserType();
  const isDistributor = userType === 4;

  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  return (
    <div
      style={{
        maxWidth: "1600px",
        margin: "0 auto",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Layout className={styles.layout}>
        {isDistributor ? (
          <Navbar />
        ) : (
          <SideBar collapsed={collapsed} onToggle={toggleSidebar} />
        )}

        <Layout
          className={styles.innerLayout}
          style={{
            height: "100vh",
            overflowY: "auto",
            paddingTop: isDistributor || isMobile ? "60px" : "0px",
          }}
        >
          <Content className={styles.content}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default MainLayout;

