import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AddDistributorInventoryLog } from "../Service/ApiServices";
import { useToken } from "../Hooks/UserHook";
import CustomDropDown from "../Components/CustomDropDown";
import FormField from "../Components/InputField";
import CustomButton from "../Components/Button";
import CustomModal from "../Components/CustomModal";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const getDistributorLogValidationSchema = () =>
  Yup.object({
    distributer_id: Yup.string().required("Distributor is required"),
    given_qty: Yup.number()
      .min(1, "Minimum quantity is 1")
      .required("Quantity is required"),
    type: Yup.number().required("Type is required"),
  });

const AddDistributorLogModal = ({ visible, onClose, onSuccess }: Props) => {
  const [formLoading, setFormLoading] = useState(false);
  const token = useToken();



  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues: {
      distributer_id: "",
      given_qty: 1,
      type: "",
    },
    validationSchema: getDistributorLogValidationSchema(),
    onSubmit: (values) => submitDistributorLog(values),
    validateOnChange: false,
    validateOnBlur: true,
  });

    const submitDistributorLog = (values: any) => {
    if (!token) return;

    const formData = new FormData();
    formData.append("token", token);
    formData.append("distributer_id", values.distributer_id);
    formData.append("given_qty", String(values.given_qty));
    formData.append("type", String(values.type));

    setFormLoading(true);

    AddDistributorInventoryLog(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success("Distributor log added successfully");
          resetForm();
          onSuccess();
          onClose();
        } else {
          toast.error(res.data.msg || "Failed to add log");
        }
      })
      .catch(() => {
        toast.error("Something went wrong while submitting");
      })
      .finally(() => {
        setFormLoading(false);
      });
  };

  return (
    <CustomModal
      title="Add Distributor Log"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <form onSubmit={handleSubmit}>
        <CustomDropDown
          dropdownKeys={["distributer_id"]}
          formik={{ values, setFieldValue, handleBlur, touched, errors }}
          className="col-12"
        />

        <CustomDropDown
          dropdownKeys={["type"]}
          formik={{ values, setFieldValue, handleBlur, touched, errors }}
          className="col-12"
        />

        <FormField
          label="Quantity (L)"
          type="number"
          name="given_qty"
          value={values.given_qty}
          placeholder="Enter quantity"
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.given_qty}
          touched={touched.given_qty}
        />

        <div className="d-flex justify-content-end mt-3">
          <CustomButton
            type="button"
            className="btn btn-sm mx-2 btn-error"
            onClick={onClose}
          >
            Cancel
          </CustomButton>

          <CustomButton
            type="submit"
            className="btn btn-sm btn-submit"
            disabled={formLoading}
          >
            {formLoading ? "Submitting..." : "Submit"}
          </CustomButton>
        </div>
      </form>
    </CustomModal>
  );
};

export default AddDistributorLogModal;
