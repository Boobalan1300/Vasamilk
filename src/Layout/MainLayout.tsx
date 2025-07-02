
import React, { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import styles from "./MainLayout.module.css";

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed((prev) => !prev);

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
        <SideBar collapsed={collapsed} onToggle={toggleSidebar} />
        <Layout
          className={styles.innerLayout}
          style={{
            height: "100vh",
            overflowY: "auto",
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
