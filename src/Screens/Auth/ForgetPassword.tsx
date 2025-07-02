import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Row, Col, Typography } from "antd";
import { toast } from "react-toastify";

import FormField from "../../Components/InputField";
import Button from "../../Components/Button";
import { handleForgetPasswordService } from "../../Service/ApiServices";
import { Images } from "../../Utils/Images";
import { setEncryptedCookie } from "../../Utils/Cookie";

import "../../Styles/Common.css";
import '../../Styles/FromFields.css'

const { Title } = Typography;

type ForgetFormType = {
  userInput: string;
};

const validationSchema = Yup.object({
  userInput: Yup.string()
    .required("Email or Phone Number is required")
    .test("is-valid-input", "Invalid email or phone number", function (value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10}$/;
      return !!value && (emailRegex.test(value) || phoneRegex.test(value));
    }),
});

const ForgetPassword = () => {
  const navigate = useNavigate();

  const handleFormSubmit = (values: ForgetFormType) => {
    const formData = new FormData();
    formData.append("email", values.userInput);

  handleForgetPasswordService(formData)
    .then((res) => {
      const { data } = res;

      if (data.status === 1 && data.reset_key) {
        
        setEncryptedCookie("reset_key", data.reset_key, 5);

        sessionStorage.setItem("forgotInitiated", "true");

        toast.success("OTP sent successfully!");
        navigate("/verify-otp");
      } else {
        toast.error(data?.msg || "Account fetching failed.");
      }
    })
    .catch((err) => {
      console.error("Forget password error:", err);
      toast.error("Something went wrong. Please try again.");
    });
};

  const formik = useFormik<ForgetFormType>({
    initialValues: { userInput: "" },
    validationSchema,
    onSubmit: handleFormSubmit,
  });

  const { values, touched, errors, handleChange, handleBlur, handleSubmit } =
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
      <Row
        className="w-100 shadow rounded p-4 transparent-box"
        style={{ maxWidth: "900px" }}
      >
        <Col
          xs={24}
          md={12}
          className="d-flex justify-content-center align-items-center p-4 text-center bg-light mt-4 mt-md-0"
        >
          <div className="w-100">
            <p className="mb-0 fs-5 fw-medium">
              Secure your account with Vasamilk
            </p>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div className="w-100 p-4">
            <Title level={2} className="text-center mb-4">
              Forgot Password
            </Title>
            <form onSubmit={handleSubmit}>
              <FormField
                label="Email or Phone Number"
                name="userInput"
                placeholder="Enter your email or 10-digit phone number"
                value={values.userInput}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.userInput}
                touched={touched.userInput}
              />
              <div className="d-flex justify-content-between mt-2">
                <span
                  onClick={() => navigate("/login")}
                  style={{ cursor: "pointer", color: "#1677ff" }}
                >
                  Back to Login
                </span>
              </div>
              <Button htmlType="submit" block className="AuthButton mt-3">
                Send OTP
              </Button>
            </form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ForgetPassword;
