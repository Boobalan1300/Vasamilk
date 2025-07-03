import React, { useState } from "react";
import { Drawer, Menu, Button, Grid, Layout, message } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useUserType, useToken } from "../Hooks/UserHook";
import { handleLogout } from "../Service/ApiServices";
import { clearCookie } from "../Utils/Cookie";

const { useBreakpoint } = Grid;
const { Header } = Layout;

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const [visible, setVisible] = useState(false);

  const userType = useUserType();
  const token = useToken();

  const handleNavigate = (path: string) => {
    navigate(path);
    setVisible(false);
  };

  const logoutUser = () => {
    if (!token) {
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("token", token);

    handleLogout(formData)
      .then(() => {
        clearCookie("user_data");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout failed", error);
        message.error("Logout failed. Please try again.");
      });
  };

  const menuItems =
    userType === 4
      ? [
          { key: "dashboard", label: "Dashboard", path: "/distributorDashboard" },
         
        ]
      : userType === 5
      ? [
          { key: "dashboard", label: "Dashboard", path: "/dashboard" },
          { key: "orders", label: "My Orders", path: "/customer/orders" },
          { key: "payments", label: "Payments", path: "/customer/payments" },
          { key: "profile", label: "Profile", path: "/profile" },
        ]
      : [];

  const renderMenu = (
    <Menu
      mode={screens.lg ? "horizontal" : "vertical"}
      theme="dark"
      selectable={false}
      style={screens.lg ? { borderBottom: "none", background: "transparent" } : {}}
    >
      {menuItems.map((item) => (
        <Menu.Item key={item.key} onClick={() => handleNavigate(item.path)}>
          {item.label}
        </Menu.Item>
      ))}
      <Menu.Divider />
      <Menu.Item key="logout" onClick={logoutUser}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "60px",
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "var(--primary-color)",
        padding: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "white" }}>
        VASAMILK
      </div>

      {screens.lg ? (
        <div>{renderMenu}</div>
      ) : (
        <>
          <Button
            type="text"
            icon={<MenuOutlined style={{ color: "white", fontSize: "24px" }} />}
            onClick={() => setVisible(true)}
          />
          <Drawer
            title="Menu"
            placement="right"
            onClose={() => setVisible(false)}
            open={visible}
            bodyStyle={{ padding: 0 }}
          >
            {renderMenu}
          </Drawer>
        </>
      )}
    </Header>
  );
};

export default Navbar;
