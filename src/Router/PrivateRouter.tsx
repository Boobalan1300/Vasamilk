import { Navigate, Outlet } from "react-router-dom";
import { useToken } from "../Hooks/UserHook";
import { useUserType } from "../Hooks/UserHook";

// prevents authenticated users from accessing login, otp, reset pages
export const AuthPrivate = () => {
  const token = useToken();
  const user_type = useUserType();

  if (!token) return <Outlet />;

  return user_type === 1 ? <Navigate to="/inventory" replace /> :
        //  user_type === 2 ? <Navigate to="/distributorDashboard" replace /> :
         user_type === 4 ? <Navigate to="/distributorDashboard" replace /> :
         <Navigate to="*" replace />;
};

// ensures user can't directly access verify-otp or reset-password without the right flow
export const ProtectedRoute = ({ authType }: { authType: "otp" | "reset" }) => {
  const forgotInitiated = sessionStorage.getItem("forgotInitiated");
  const otpVerified = sessionStorage.getItem("otpVerified");
  const resetReached = sessionStorage.getItem("resetReached");

  if (
    authType === "otp" &&
    forgotInitiated === "true" &&
    resetReached !== "true"
  ) {
    return <Outlet />;
  }

  if (authType === "reset" && otpVerified === "true") {
    sessionStorage.setItem("resetReached", "true");
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
};

// allows only specific user_type values to access realted specific pages
export const PrivateRoute = ({ allowedUserTypes }: { allowedUserTypes: number[] }) => {
  const user_type = useUserType();

 if (!allowedUserTypes.includes(user_type ?? -1)) {
    return user_type === 1 ? <Navigate to="/inventory" replace /> :
          //  user_type === 2 ? <Navigate to="/distributorDashboard" replace /> :
           user_type === 4 ? <Navigate to="/distributorDashboard" replace /> :
           <Navigate to="*" replace />;
  }

  return <Outlet />;
};


// ensures only authenticated users can access routes wrapped by MainLayout
export const PublicRoute = () => {
  const token = useToken();
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
};
