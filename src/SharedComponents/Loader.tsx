// import { Spin } from "antd";
// import { useSelector } from "react-redux";
// import type { RootState } from "../Store/Store";

// const GlobalLoader = () => {
//   const loading = useSelector((state: RootState) => state.loader.loading);

//   return (
//     loading ? (
//       <div
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: "100vw",
//           height: "100vh",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           backgroundColor: "rgba(255, 255, 255, 0.7)",
//           zIndex: 9999,
//         }}
//       >
//         <Spin size="large" />
//       </div>
//     ) : null
//   );
// };

// export default GlobalLoader;


import { useSelector } from "react-redux";
import type { RootState } from "../Store/Store";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const GlobalLoader = () => {
  const loading = useSelector((state: RootState) => state.loader.loading);

  if (!loading) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(4px)",
        backgroundColor: "rgba(28, 41, 57, 0.4)", 
        zIndex: 9999,
      }}
    >
      <div
        style={{
          textAlign: "center",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Spin
          indicator={
            <LoadingOutlined
              style={{ fontSize: 48, color: "var(--primary-color)" }}
              spin
            />
          }
        />
        <div style={{ fontSize: "1.5rem", fontWeight: 600 }}>
          VASAMILK
        </div>
        <p style={{ fontSize: "1rem", margin: 0 }}>Loading, please wait...</p>
      </div>
    </div>
  );
};

export default GlobalLoader;
