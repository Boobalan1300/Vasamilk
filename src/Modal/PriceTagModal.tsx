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
import { CreatePriceTag,UpdatePriceTag } from "../Service/ApiServices";

export interface PriceTag {
  id: number;
  name: string;
  price: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  priceTagData?: PriceTag;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  price: Yup.string().required("Price is required"),
});

const initialValues = { name: "", price: "" };

const PriceTagModal: React.FC<Props> = ({ visible, onClose, onSuccess, priceTagData }) => {
  const token = useToken();
  const { showLoader, hideLoader } = useLoader();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => handleFormSubmit(values),
    enableReinitialize: true,
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setValues } = formik;

useEffect(() => {
  if (visible) {
    initializeForm();
  }
}, [visible]);

const initializeForm = () => {
  if (priceTagData) {
    setValues( { name: priceTagData.name, price: priceTagData.price });
  } else {
    setValues( initialValues );
  }
    formik.setTouched({}); 
};

  const handleFormSubmit = (values: typeof initialValues) => {
    if (!token) {
      toast.error("No token found!");
      return;
    }

    const formData = new FormData();
    formData.append("token", token);
    formData.append("name", values.name);
    formData.append("price", values.price);

    if (priceTagData) {
      formData.append("price_tag_id", String(priceTagData.id));
      showLoader();
      UpdatePriceTag(formData)
        .then((res) => {
          if (res.data.status === 1) {
            toast.success(res.data.msg || "Price tag updated successfully");
            onSuccess();
            onClose();
          } else {
            toast.info(res.data.msg || "Failed to update price tag");
          }
        })
        .catch((err) => {
          console.error("UpdatePriceTag error:", err);
          toast.error("Something went wrong while updating price tag");
        })
        .finally(() => hideLoader());
    } else {
      showLoader();
      CreatePriceTag(formData)
        .then((res) => {
          if (res.data.status === 1) {
            toast.success(res.data.msg || "Price tag created successfully");
            onSuccess();
            onClose();
          } else {
            toast.info(res.data.msg || "Failed to create price tag");
          }
        })
        .catch((err) => {
          console.error("CreatePriceTag error:", err);
          toast.error("Something went wrong while creating price tag");
        })
        .finally(() => hideLoader());
    }
  };

  return (
    <CustomModal
      title={priceTagData ? "Edit Price Tag" : "Add Price Tag"}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <form onSubmit={handleSubmit}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <FormField
              label="Price Tag Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter price tag name"
              error={errors.name}
              touched={touched.name}
            />
          </Col>
          <Col span={24}>
            <FormField
              label="Price"
              name="price"
              value={values.price}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter price"
              error={errors.price}
              touched={touched.price}
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

export default PriceTagModal;
