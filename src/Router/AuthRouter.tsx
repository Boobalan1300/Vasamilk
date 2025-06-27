import ForgetPassword from "../Screens/Auth/ForgetPassword";
import Login from "../Screens/Auth/Login";
import ResetPassword from "../Screens/Auth/ResetPassword";
import VerifyOtp from "../Screens/Auth/VerifyOtp";
import { ProtectedRoute } from "./PrivateRouter";

export const AuthRouter = [
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/forget-password", element: <ForgetPassword /> },
  {
    path: "/verify-otp",
    element: <ProtectedRoute authType="otp" element={<VerifyOtp />} />,
  },
  {
    path: "/resetPassword",
    element: <ProtectedRoute authType="reset" element={<ResetPassword />} />,
  },
];
