import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../../Components/Button";
import { Input, Row, Col, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../../Styles/FromFields.css'

import {
  handleVerifyOtp as apiVerifyOtp,
  handleResendOtp as apiResendOtp,
} from "../../Service/ApiServices";

import {
  getDecryptedCookie,
  setEncryptedCookie,
} from "../../Utils/Cookie";

import { Images } from "../../Utils/Images";
import "../../Styles/Common.css";
import CustomButton from "../../Components/Button";

const { OTP } = Input;
const { Title } = Typography;

type OtpFormType = {
  otp: string;
};

const validationSchema = Yup.object().shape({
  otp: Yup.string()
    .required("OTP is required")
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

const RESET_KEY_COOKIE = "reset_key";

const VerifyOtp: React.FC = () => {
  const navigate = useNavigate();
  const [resendLoading, setResendLoading] = useState(false);

  const formik = useFormik<OtpFormType>({
    initialValues: { otp: "" },
    validationSchema,
    onSubmit: (values) => {
      const resetKey = getDecryptedCookie(RESET_KEY_COOKIE);

      if (!resetKey) {
        toast.error("Reset key not found or invalid. Please try again.");
        return;
      }

      const formData = new FormData();
      formData.append("otp", values.otp);
      formData.append("reset_key", resetKey);

      apiVerifyOtp(formData)
        .then((res) => {
          const { data } = res;
          if (data.status === 1) {
            toast.success("OTP verified successfully!");
           
            setEncryptedCookie(RESET_KEY_COOKIE, data.reset_key, 5);

            sessionStorage.setItem("otpVerified", "true");
            sessionStorage.removeItem("forgotInitiated");

            navigate("/resetPassword");
          } else {
            toast.error(data.msg || "OTP verification failed.");
          }
        })
        .catch((err) => {
          console.error("API error:", err);
          toast.error("Error verifying OTP. Please try again.");
        });
    },
  });

  const { values, errors, touched, handleSubmit, setFieldValue } = formik;

  const handleResendOtp = () => {
    const resetKey = getDecryptedCookie(RESET_KEY_COOKIE);
    if (!resetKey) {
      toast.error("Reset key not found or invalid. Please try again.");
      return;
    }

    setResendLoading(true);

    const formData = new FormData();
    formData.append("reset_key", resetKey);

    apiResendOtp(formData)
      .then((res) => {
        const { data } = res;
        if (data.status === 1) {
          toast.success("OTP resent successfully!");
          setEncryptedCookie(RESET_KEY_COOKIE, data.reset_key, 5);
        } else {
          toast.error(data.msg || "Failed to resend OTP.");
        }
      })
      .catch((err) => {
        console.error("API error:", err);
        toast.error("Error resending OTP. Please try again.");
      })
      .finally(() => {
        setResendLoading(false);
      });
  };

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
              Verify OTP
            </Title>
            <form onSubmit={handleSubmit}>
              <div className="text-center">
                <OTP
                  value={values.otp}
                  onChange={(value) => setFieldValue("otp", value)}
                  length={6}
                  autoFocus
                  style={{ letterSpacing: "0.5em", fontSize: "1.5em" }}
                />
                {touched.otp && errors.otp && (
                  <div style={{ color: "red", marginTop: "8px" }}>
                    {errors.otp}
                  </div>
                )}
                <div className="d-flex justify-content-between mt-3">
                  <span
                    style={{ cursor: "pointer", color: "#1677ff" }}
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </span>
                  <span
                    style={{
                      cursor: resendLoading ? "not-allowed" : "pointer",
                      color: "#1677ff",
                      userSelect: "none",
                    }}
                    onClick={() => !resendLoading && handleResendOtp()}
                  >
                    {resendLoading ? "Resending..." : "Resend OTP"}
                  </span>
                </div>
                <CustomButton className="mt-3  w-100 AuthButton"  type="submit">
                  Verify OTP
                </CustomButton>
              </div>
            </form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default VerifyOtp;
