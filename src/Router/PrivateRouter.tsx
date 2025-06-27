import { Navigate, Outlet } from "react-router-dom";
import { getDecryptedCookie } from "../Utils/Cookie";

const getUserAuth = () => {
  const decrypted = getDecryptedCookie("user_data");
  return JSON.parse(decrypted || "{}") || {};
};

//  prevents authenticated users to login,otp,reset
export const AuthPrivate = () => {
  const { token, user_type } = getUserAuth();
  if (!token) return <Outlet />;

  switch (user_type) {
    case 1: return <Navigate to="/userManagement" replace />;
    case 2: return <Navigate to="/distributorDashboard" replace />;
    case 3: return <Navigate to="/vendorDashboard" replace />;
    default: return <Navigate to="/unauthorized" replace />;
  }
};

// ensures user cant directly access otp,resetPassword without right flow
export const ProtectedRoute = ({
  element,
  authType,
}: {
  element: React.ReactElement;
  authType: "otp" | "reset";
}) => {
  const forgotInitiated = sessionStorage.getItem("forgotInitiated");
  const otpVerified = sessionStorage.getItem("otpVerified");
  const resetReached = sessionStorage.getItem("resetReached");

  if (authType === "otp" && forgotInitiated === "true" && resetReached !== "true") {
    return element;
  }

  if (authType === "reset" && otpVerified === "true") {
    sessionStorage.setItem("resetReached", "true");
    return element;
  }

  return <Navigate to="/login" replace />;
};

// allows only specific user_type to access certain pages
export const PrivateRoute = ({ allowedUserTypes }: { allowedUserTypes: number[] }) => {
  const { token, user_type } = getUserAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (!allowedUserTypes.includes(user_type)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};


// ensures only authenticated users can access Mainlayout
export const PublicRoute = () => {
  const decrypted = getDecryptedCookie("user_data");
  const { token } = JSON.parse(decrypted || "{}");
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
};
