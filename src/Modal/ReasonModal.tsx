import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Row, Col, Select } from "antd";
import CustomModal from "../Components/CustomModal";
import CustomButton from "../Components/Button";
import FormField from "../Components/InputField";
import { useToken } from "../Hooks/UserHook";
import { useLoader } from "../Hooks/useLoader";
import { toast } from "react-toastify";
import { CreateReason, UpdateReason } from "../Service/ApiServices";
import type { Reason } from "../Screens/Home/Masters/ReasonManagement";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  reasonData?: Reason;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  type: Yup.number().oneOf([1, 2, 3]).required("Type is required"),
});

const initialValues = {
  name: "",
  type: undefined as number | undefined,
};

const ReasonModal: React.FC<Props> = ({ visible, onClose, onSuccess, reasonData }) => {
  const token = useToken();
  const { showLoader, hideLoader } = useLoader();

  const handleFormSubmit = (values: typeof initialValues) => {
    if (!token) {
      toast.error("No token found!");
      return;
    }
    const formData = new FormData();
    formData.append("token", token);
    formData.append("name", values.name);
    formData.append("type", String(values.type));

    if (reasonData) {
      formData.append("reason_id", String(reasonData.id));
      showLoader();
      UpdateReason(formData)
        .then((res) => {
          if (res.data.status === 1) {
            toast.success(res.data.msg || "Reason updated successfully");
            onSuccess();
            onClose();
          } else {
            toast.info(res.data.msg || "Failed to update reason");
          }
        })
        .catch((err) => {
          console.error("UpdateReason error:", err);
          toast.error("Something went wrong while updating reason");
        })
        .finally(() => hideLoader());
    } else {
      showLoader();
      CreateReason(formData)
        .then((res) => {
          if (res.data.status === 1) {
            toast.success(res.data.msg || "Reason created successfully");
            onSuccess();
            onClose();
          } else {
            toast.info(res.data.msg || "Failed to create reason");
          }
        })
        .catch((err) => {
          console.error("CreateReason error:", err);
          toast.error("Something went wrong while creating reason");
        })
        .finally(() => hideLoader());
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleFormSubmit,
    enableReinitialize: true,
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setValues, setFieldValue } = formik;

useEffect(() => {
  if (visible) {
    initializeForm();
  }
}, [visible, reasonData]);

const initializeForm = () => {
  if (reasonData) {
    setValues({ name: reasonData.name, type: reasonData.type });
  } else {
    setValues(initialValues);
  }
  formik.setTouched({}); 
};


  return (
    <CustomModal title={reasonData ? "Edit Reason" : "Add Reason"} open={visible} onCancel={onClose} footer={null}>
      <form onSubmit={handleSubmit}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <FormField
              label="Reason Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter reason name"
              error={errors.name}
              touched={touched.name}
            />
          </Col>
          <Col span={24}>
            <label className="form-label">Type</label>
            <Select
              placeholder="Select reason type"
              value={values.type}
              onChange={(value) => setFieldValue("type", value)}
              className="w-100"
            >
              <Select.Option value={1}>Vendor/Logger</Select.Option>
              <Select.Option value={2}>Distributor</Select.Option>
              <Select.Option value={3}>Customer</Select.Option>
            </Select>
            {errors.type && touched.type && <div className="text-danger mt-1">{errors.type}</div>}
          </Col>
        </Row>
        <div className="d-flex justify-content-end mt-3">
          <CustomButton type="button" className="btn btn-sm mx-2 btn-error" onClick={onClose}>
            Cancel
          </CustomButton>
          <CustomButton type="submit" className="btn btn-sm btn-submit">
            Submit
          </CustomButton>
        </div>
      </form>
    </CustomModal>
  );
};

export default ReasonModal;
