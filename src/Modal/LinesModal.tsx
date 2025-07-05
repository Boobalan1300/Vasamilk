import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Row, Col } from "antd";
import CustomModal from "../Components/CustomModal";
import CustomButton from "../Components/Button";
import FormField from "../Components/InputField";
import { useToken } from "../Hooks/UserHook";
import { useLoader } from "../Hooks/useLoader";
import { toast } from "react-toastify";
import { CreateLine, UpdateLine } from "../Service/ApiServices";
import type { Line } from "../Screens/Home/Masters/LinesManagement";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lineData?: Line;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
});

const initialValues = {
  name: "",
  description: "",
};

const LinesModal: React.FC<Props> = ({ visible, onClose, onSuccess, lineData }) => {
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
    formData.append("description", values.description);

    if (lineData) {
      formData.append("lines_id", String(lineData.id));
      showLoader();
      UpdateLine(formData)
        .then((res) => {
          if (res.data.status === 1) {
            toast.success(res.data.msg || "Line updated successfully");
            onSuccess();
            onClose();
          } else {
            toast.info(res.data.msg || "Failed to update line");
          }
        })
        .catch((err) => {
          console.error("UpdateLine error:", err);
          toast.error("Something went wrong while updating line");
        })
        .finally(() => hideLoader());
    } else {
      showLoader();
      CreateLine(formData)
        .then((res) => {
          if (res.data.status === 1) {
            toast.success(res.data.msg || "Line created successfully");
            onSuccess();
            onClose();
          } else {
            toast.info(res.data.msg || "Failed to create line");
          }
        })
        .catch((err) => {
          console.error("CreateLine error:", err);
          toast.error("Something went wrong while creating line");
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

  const { values, errors, touched, handleChange, handleBlur, handleSubmit,setValues } = formik;


useEffect(() => {
  if (visible) {
    initializeForm();
  }
}, [visible]);

const initializeForm = () => {
  if (lineData) {
    // resetForm({ values: { name: lineData.name, description: lineData.description } });
      setValues( { name: lineData.name, description: lineData.description });
  } else {
    // resetForm({ values: initialValues });
    setValues(initialValues);
  }
    formik.setTouched({}); 
};

  return (
    <CustomModal
      title={lineData ? "Edit Line" : "Add Line"}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <form onSubmit={handleSubmit}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <FormField
              label="Line Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter line name"
              error={errors.name}
              touched={touched.name}
            />
          </Col>
          <Col span={24}>
            <FormField
              label="Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter description"
              error={errors.description}
              touched={touched.description}
            />
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

export default LinesModal;
