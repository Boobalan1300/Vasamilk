import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, Drawer, Button, Grid, message } from "antd";
import { RightOutlined, LeftOutlined, MenuOutlined } from "@ant-design/icons";

import { Images } from "../Utils/Images";
import { handleLogout } from "../Service/ApiServices";
import { useUserType, useToken } from "../Hooks/UserHook";
import { clearCookie } from "../Utils/Cookie";
import CustomButton from "../Components/Button";

import "../Styles/Common.css";

const { Sider } = Layout;
const { useBreakpoint } = Grid;

type SideBarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const SideBar: React.FC<SideBarProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const token = useToken();
  const userType = useUserType();
  const screens = useBreakpoint();

  const [drawerVisible, setDrawerVisible] = useState(false);

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
      .catch(() => {
        message.error("Logout failed. Please try again.");
      });
  };

  const menuItems = [
    ...(userType === 0 || userType === 1
      ? [
          {
            key: "1",
            icon: (
              <img
                src={Images.inventory}
                className="iconStyle"
                alt="inventory"
              />
            ),
            label: "Inventory",
            onClick: () => navigate("/inventory"),
          },
          {
            key: "2",
            icon: (
              <img
                src={Images.distributor}
                className="iconStyle"
                alt="distributor"
              />
            ),
            label: "Distributor",
            onClick: () => navigate("/distributorList"),
          },

          {
            key: "3",
            icon: <img src={Images.user} className="iconStyle" alt="users" />,
            label: "Users",
            onClick: () => navigate("/userManagement"),
          },
          {
            key: "masters",
            icon: (
              <img src={Images.dashboard} className="iconStyle" alt="masters" />
            ),
            label: "Masters",
            children: [
              {
                key: "masters-slot",
                label: "Slot",
                onClick: () => navigate("/masters/slotManagement"),
              },
              {
                key: "masters-lines",
                label: "Lines",
                onClick: () => navigate("/masters/linesManagement"),
              },
              {
                key: "masters-price",
                label: "Price",
                onClick: () => navigate("/masters/priceManagement"),
              },
              {
                key: "masters-reason",
                label: "Reason",
                onClick: () => navigate("/masters/reasonManagement"),
              },
            ],
          },
          {
            key: "sales",
            icon: <img src={Images.sales} className="iconStyle" alt="sales" />,
            label: "Sales",
            onClick: () => navigate("/sales"),
          },
          {
            key: "place-order",
            icon: (
              <img
                src={Images.placeOrder}
                className="iconStyle"
                alt="place order"
              />
            ),
            label: "Place Order",
            onClick: () => navigate("/placeOrder"),
          },
        ]
      : []),
    ...(userType === 4
      ? [
          {
            key: "4",
            icon: (
              <img
                src={Images.distributor}
                className="iconStyle"
                alt="dashboard"
              />
            ),
            label: "Dashboard",
            onClick: () => navigate("/distributorDashboard"),
          },
        ]
      : []),
    {
      key: "logout",
      icon: <img src={Images.logout} className="iconStyle" alt="logout" />,
      label: "Logout",
      onClick: logoutUser,
    },
  ];

  const MenuComponent = (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={["1"]}
      items={menuItems}
    />
  );

  if (!screens.sm) {
    return (
      <>
        <Button
          icon={<MenuOutlined />}
          onClick={() => setDrawerVisible(true)}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1000,
            background: "#EDE7F6",
            color: "#000",
            border: "none",
            padding: "6px 12px",
            height: "auto",
          }}
          type="primary"
        >
          Menu
        </Button>

        <Drawer
          title="Menu"
          placement="right"
          closable
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          bodyStyle={{ padding: 0 }}
          width={220}
        >
          {MenuComponent}
        </Drawer>
      </>
    );
  }

  return (
    <Sider
      collapsed={collapsed}
      width={200}
      style={{
        padding: "10px",
        height: "100vh",
      }}
      className="custom-sider"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        {MenuComponent}
        <CustomButton
          onClick={onToggle}
          className="btn btn-link text-white w-100 p-2 text-center"
          style={{
            border: "none",
            outline: "none",
            background: "#344153",
            fontSize: "1.2rem",
          }}
        >
          {collapsed ? <RightOutlined /> : <LeftOutlined />}
        </CustomButton>
      </div>
    </Sider>
  );
};

export default SideBar;
