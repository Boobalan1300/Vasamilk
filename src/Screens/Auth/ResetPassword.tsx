import { useFormik } from "formik";
import * as Yup from "yup";
import FormField from "../../Components/InputField";

import { Row, Col, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

import { handleResetPassword } from "../../Service/ApiServices";
import { getDecryptedCookie } from "../../Utils/Cookie";
import { Images } from "../../Utils/Images";
import "../../Styles/Common.css";
import '../../Styles/FromFields.css'
import CustomButton from "../../Components/Button";

const { Title } = Typography;

type ResetFormType = {
  password: string;
  confirmPassword: string;
};

const validationSchema = Yup.object({
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const ResetPassword = () => {
  const navigate = useNavigate();

  const handleResetSubmit = (values: ResetFormType) => {
     const resetKey = getDecryptedCookie("reset_key");

    if (!resetKey) {
      toast.error("Reset key not found or expired."); 
      return;
    }

    const formData = new FormData();
    formData.append("reset_key", resetKey);
    formData.append("new_password", values.password);

    handleResetPassword(formData)
      .then((res) => {
        const { data } = res;
        if (data.status === 1) {
          toast.success("Password reset successful!");
          
          sessionStorage.removeItem("forgotInitiated");
          sessionStorage.removeItem("otpVerified");

          navigate("/login");
        } else {
          toast.error(data.msg || "Password reset failed.");
        }
      })
      .catch((error) => {
        console.error("Reset error:", error);
        toast.error("Something went wrong. Please try again."); 
      });
  };

  const formik = useFormik<ResetFormType>({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: handleResetSubmit,
  });

  const { values, touched, errors, handleChange, handleBlur, handleSubmit } = formik;

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
              Reset Your Password
            </Title>
            <form onSubmit={handleSubmit}>
              <FormField
                label="New Password"
                type="password"
                name="password"
                placeholder="Enter new password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
                touched={touched.password}
              />
              <FormField
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
              />
              <div className="d-flex justify-content-between mt-2">
                <span
                  onClick={() => navigate(-1)}
                  style={{ cursor: "pointer", color: "#1677ff" }}
                >
                  Back
                </span>
              </div>
              <CustomButton type="submit"  className="AuthButton  w-100 mt-3">
                Reset Password
              </CustomButton>
            </form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ResetPassword;
