import { Spin } from "antd";
import { useSelector } from "react-redux";
import type { RootState } from "../Store/Store";

const GlobalLoader = () => {
  const loading = useSelector((state: RootState) => state.loader.loading);

  return (
    loading ? (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          zIndex: 9999,
        }}
      >
        <Spin tip="Loading..." size="large" />
      </div>
    ) : null
  );
};

export default GlobalLoader;
