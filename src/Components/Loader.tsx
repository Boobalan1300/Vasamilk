import React from "react";
import { Spin, Alert } from "antd";
import { useLoader } from "../Context/LoaderContext";

const Loader: React.FC = () => {
  const { loading, error, setError } = useLoader();

  if (!loading && !error) return null;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1500 }}>
      {loading && (
        <Spin
          tip="Loading..."
          size="large"
          style={{
            display: "block",
            margin: "10px auto",
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: 20,
          }}
        />
      )}
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
          style={{ margin: "0 auto", maxWidth: 600 }}
        />
      )}
    </div>
  );
};

export default Loader;
