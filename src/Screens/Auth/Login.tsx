import { useFormik } from "formik";
import * as Yup from "yup";
import { sha1 } from "js-sha1";
import { toast } from "react-toastify";
import { Row, Col, Typography, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";

import { handleLogin } from "../../Service/ApiServices";
import { Images } from "../../Utils/Images";
import FormField from "../../Components/InputField";

import { SALT_KEY } from "../../../public/config";

import "react-toastify/dist/ReactToastify.css";
import "../../Styles/Common.css";
import { useEffect } from "react";
import { setEncryptedCookie } from "../../Utils/Cookie";
import "../../Styles/FromFields.css";
import CustomButton from "../../Components/Button";

const { Title } = Typography;

type LoginFormType = {
  userName: string;
  password: string;
};

const validationSchema = Yup.object({
  userName: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    clearForgotPasswordSession();
  }, []);

  const clearForgotPasswordSession = () => {
    sessionStorage.removeItem("forgotInitiated");
    sessionStorage.removeItem("otpVerified");
    sessionStorage.removeItem("resetReached");
  };

  const handleLoginSubmit = (values: LoginFormType) => {
    const auth_code = sha1(SALT_KEY + values.userName);

    const formData = new FormData();
    formData.append("user_name", values.userName);
    formData.append("password", values.password);
    formData.append("device_type", "3");
    formData.append("auth_code", auth_code);

    handleLogin(formData)
      .then((response) => {
        const { data } = response;

        if (data.status === 1) {
          toast.success("Login successful!");

          const authData = {
            token: data.token,
            user_id: data.user_id,
            user_name: data.user_name,
            user_type: data.user_type,
          };

          setEncryptedCookie("user_data", authData, 120);
          navigate("/inventory");
        } else if (data.status === 2) {
          sessionStorage.setItem("forgotInitiated", "true");
          sessionStorage.setItem("otpUser", values.userName);
          setEncryptedCookie("reset_key", data.reset_key);

          navigate("/reset-password");
          toast.info("OTP has been sent. Please reset your password.");

          navigate("/verify-otp");
        } else {
          toast.error(data.msg || "Login failed.");
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.msg || "Something went wrong.");
      });
  };

  const formik = useFormik<LoginFormType>({
    initialValues: { userName: "", password: "" },
    validationSchema,
    onSubmit: handleLoginSubmit,
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    formik;

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: `url(${Images.milk3})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Row className="w-100 p-4 transparent-box" style={{ maxWidth: "900px" }}>
        <Col
          xs={24}
          md={12}
          className="d-flex justify-content-center align-items-center p-4 text-center bg-light mt-4 mt-md-0"
        >
          <div>
            {/* <img src={Images.logo} className="w-50 h-50" /> */}
            <p className="mb-0 fs-5 fw-medium">
              Join us to get seamless delivery with us
            </p>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div className="w-100 p-4">
            <Title level={2} className="text-center mb-4">
              Sign in to Vasamilk
            </Title>
            <form onSubmit={handleSubmit}>
              <FormField
                label="Username"
                name="userName"
                value={values.userName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your username"
                error={errors.userName}
                touched={touched.userName}
              />
              <FormField
                label="Password"
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your password"
                error={errors.password}
                touched={touched.password}
              />

              <div className="d-flex justify-content-between align-items-center m-2">
                <Checkbox>Remember me</Checkbox>
                <span
                  onClick={() => navigate("/forget-password")}
                  style={{ cursor: "pointer", color: "#1677ff" }}
                >
                  Forgot Password?
                </span>
              </div>

              <CustomButton type="submit" className="mt-3 w-100 AuthButton">
                Sign In
              </CustomButton>
            </form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
