import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Row, Col } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { toast } from "react-toastify";
import CustomButton from "../Components/Button";
import FormField from "../Components/InputField";
import CustomModal from "../Components/CustomModal";
import { useToken } from "../Hooks/UserHook";
import { useLoader } from "../Hooks/useLoader";
import { UpdateSlot } from "../Service/ApiServices";
import type { Slot } from "../Utils/Types/Masters";
import CustomTimePicker from "../Components/CustomTimePicker";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  slotData?: Slot;
};

type SlotFormValues = {
  name: string;
  inventory_end_time: Dayjs | null;
  start_time: Dayjs | null;
  end_time: Dayjs | null;
  booking_end: Dayjs | null;
};

const slotValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  inventory_end_time: Yup.mixed().required("Inventory End Time is required"),
  start_time: Yup.mixed().required("Start Time is required"),
  end_time: Yup.mixed().required("End Time is required"),
  booking_end: Yup.mixed().required("Booking End is required"),
});

const slotInitialValues: SlotFormValues = {
  name: "",
  inventory_end_time: null,
  start_time: null,
  end_time: null,
  booking_end: null,
};

const SlotEditModal: React.FC<Props> = ({
  visible,
  onClose,
  onSuccess,
  slotData,
}) => {
  const token = useToken();
  const { showLoader, hideLoader } = useLoader();

  const formik = useFormik<SlotFormValues>({
    initialValues: slotInitialValues,
    validationSchema: slotValidationSchema,
    onSubmit: (values) => handleSlotSubmit(values),
    validateOnChange: false,
    validateOnBlur: true,
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setFieldValue,
  } = formik;

  useEffect(() => {
    if (visible) {
      initializeFormValues();
    }
  }, [visible, slotData, setValues]);

  const initializeFormValues = () => {
    if (slotData) {
      setValues({
        name: slotData.name,
        inventory_end_time: slotData.inventory_end_time
          ? dayjs(slotData.inventory_end_time, "HH:mm:ss")
          : null,
        start_time: slotData.start_time
          ? dayjs(slotData.start_time, "HH:mm:ss")
          : null,
        end_time: slotData.end_time
          ? dayjs(slotData.end_time, "HH:mm:ss")
          : null,
        booking_end: slotData.booking_end
          ? dayjs(slotData.booking_end, "HH:mm:ss")
          : null,
      });
    } else {
      setValues(slotInitialValues);
    }
      formik.setTouched({}); 
  };

  const handleSlotSubmit = (values: SlotFormValues): void => {
    if (!token) {
      toast.error("No token found!");
      return;
    }

    const formData = new FormData();
    formData.append("token", token);

    if (slotData?.id) formData.append("slot_id", String(slotData.id));
    formData.append("name", values.name);
    formData.append(
      "inventory_end_time",
      values.inventory_end_time?.format("HH:mm:ss") ?? ""
    );
    formData.append("start_time", values.start_time?.format("HH:mm:ss") ?? "");
    formData.append("end_time", values.end_time?.format("HH:mm:ss") ?? "");
    formData.append(
      "booking_end",
      values.booking_end?.format("HH:mm:ss") ?? ""
    );

    showLoader();

    UpdateSlot(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg || "Slot updated successfully");
          onSuccess();
          onClose();
        } else {
          toast.info(res.data.msg || "Failed to update slot");
        }
      })
      .catch((error) => {
        console.error("Update slot error:", error);
        toast.error("Something went wrong while updating the slot");
      })
      .finally(() => {
        hideLoader();
      });
  };

  return (
    <CustomModal
      title={"Edit Slot"}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <form onSubmit={handleSubmit}>
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <FormField
              label="Slot Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter slot name"
              error={errors.name}
              touched={touched.name}
            />
          </Col>

          <Col xs={24} md={12}>
            <CustomTimePicker
              label="Inventory End Time"
              name="inventory_end_time"
              value={values.inventory_end_time}
              onChange={(time) => setFieldValue("inventory_end_time", time)}
              error={errors.inventory_end_time}
              touched={touched.inventory_end_time}
            />
          </Col>

          <Col xs={24} md={12}>
            <CustomTimePicker
              label="Start Time"
              name="start_time"
              value={values.start_time}
              onChange={(time) => setFieldValue("start_time", time)}
              error={errors.start_time}
              touched={touched.start_time}
            />
          </Col>

          <Col xs={24} md={12}>
            <CustomTimePicker
              label="End Time"
              name="end_time"
              value={values.end_time}
              onChange={(time) => setFieldValue("end_time", time)}
              error={errors.end_time}
              touched={touched.end_time}
            />
          </Col>

          <Col xs={24} md={12}>
            <CustomTimePicker
              label="Booking End Time"
              name="booking_end"
              value={values.booking_end}
              onChange={(time) => setFieldValue("booking_end", time)}
              error={errors.booking_end}
              touched={touched.booking_end}
            />
          </Col>
        </Row>

        <div className="d-flex justify-content-end mt-3">
          <CustomButton
            type="button"
            className="btn btn-sm mx-2 btn-error"
            onClick={onClose}
          >
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

export default SlotEditModal;
