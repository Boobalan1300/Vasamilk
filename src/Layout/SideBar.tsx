


// import React from "react";
// import { Layout, Menu, message } from "antd";
// import { RightOutlined, LeftOutlined } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";
// import { Images } from "../Utils/Images";
// import "../Styles/Common.css";
// import { clearCookie } from "../Utils/Cookie";
// import { handleLogout } from "../Service/ApiServices";
// import { useUserType, useToken } from "../Hooks/UserHook";
// import CustomButton from "../Components/Button";

// const { Sider } = Layout;

// type SideBarProps = {
//   collapsed: boolean;
//   onToggle: () => void;
// };

// const SideBar: React.FC<SideBarProps> = ({ collapsed, onToggle }) => {
//   const navigate = useNavigate();
//   const userType = useUserType();
//   const token = useToken();

//   const logoutUser = () => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("token", token);

//     handleLogout(formData)
//       .then(() => {
//         clearCookie("user_data");
//         navigate("/login");
//       })
//       .catch((error) => {
//         console.error("Logout failed", error);
//         message.error("Logout failed. Please try again.");
//       });
//   };

//   const menuItems = [
//     ...(userType === 0 || userType === 1
//       ? [
//           {
//             key: "1",
//             icon: (
//               <span className="iconWrapper">
//                 <img
//                   src={Images.inventory}
//                   alt="inventory"
//                   className="iconStyle"
//                 />
//               </span>
//             ),
//             label: "Inventory",
//             onClick: () => navigate("/inventory"),
//           },
//           {
//             key: "2",
//             icon: (
//               <span className="iconWrapper">
//                 <img
//                   src={Images.distributor}
//                   alt="Distributor"
//                   className="iconStyle"
//                 />
//               </span>
//             ),
//             label: "Distributor",
//             onClick: () => navigate("/distributorList"),
//           },
//           {
//             key: "3",
//             icon: (
//               <span className="iconWrapper">
//                 <img src={Images.user} alt="users" className="iconStyle" />
//               </span>
//             ),
//             label: "Users",
//             onClick: () => navigate("/userManagement"),
//           },
//         ]
//       : []),
//     {
//       key: "4",
//       icon: (
//         <span className="iconWrapper">
//           <img src={Images.logout} alt="Logout" className="iconStyle" />
//         </span>
//       ),
//       label: "Logout",
//       onClick: logoutUser,
//     },
//   ];

//   return (
//     <Sider
//       className="custom-sider d-flex flex-column justify-content-between"
//       collapsed={collapsed}
//       width={200}
//       style={{
//         padding: "10px",
//         height: "100vh",
//       }}
//     >
//       <Menu
//         theme="dark"
//         mode="inline"
//         defaultSelectedKeys={["1"]}
//         items={menuItems}
//       />
//       <CustomButton
//         onClick={onToggle}
//         aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//         className="btn btn-link text-white w-100 mt-auto p-2 text-center"
//         style={{
//           border: "none",
//           outline: "none",
//           background: "transparent",
//           fontSize: "1.2rem",
         
//         }}
//       >
//         {collapsed ? <RightOutlined  /> : <LeftOutlined />}
//       </CustomButton>
//     </Sider>
//   );
// };

// export default SideBar;


import React from "react";
import { Layout, Menu, message } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Images } from "../Utils/Images";
import "../Styles/Common.css";
import { clearCookie } from "../Utils/Cookie";
import { handleLogout } from "../Service/ApiServices";
import { useUserType, useToken } from "../Hooks/UserHook";
import CustomButton from "../Components/Button";

const { Sider } = Layout;

type SideBarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const SideBar: React.FC<SideBarProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const userType = useUserType();
  const token = useToken();

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

  const menuItems = [
    ...(userType === 0 || userType === 1
      ? [
          {
            key: "1",
            icon: (
              <span className="iconWrapper">
                <img
                  src={Images.inventory}
                  alt="inventory"
                  className="iconStyle"
                />
              </span>
            ),
            label: "Inventory",
            onClick: () => navigate("/inventory"),
          },
          {
            key: "2",
            icon: (
              <span className="iconWrapper">
                <img
                  src={Images.distributor}
                  alt="Distributor"
                  className="iconStyle"
                />
              </span>
            ),
            label: "Distributor",
            onClick: () => navigate("/distributorList"),
          },
          {
            key: "3",
            icon: (
              <span className="iconWrapper">
                <img src={Images.user} alt="users" className="iconStyle" />
              </span>
            ),
            label: "Users",
            onClick: () => navigate("/userManagement"),
          },
        ]
      : []),
    {
      key: "4",
      icon: (
        <span className="iconWrapper">
          <img src={Images.logout} alt="Logout" className="iconStyle" />
        </span>
      ),
      label: "Logout",
      onClick: logoutUser,
    },
  ];

  return (
    <Sider
      className="custom-sider"
      collapsed={collapsed}
      width={200}
      style={{
        padding: "10px",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItems}
        />

        <CustomButton
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
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
