import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import { useToken } from "../../../Hooks/UserHook";
import {
  fetchUserById,
  getActiveSlot,
  placeDirectCustomerLog,
} from "../../../Service/ApiServices";
import { hideLoader, showLoader } from "../../../Store/Reducer/loaderSlice";
import {
  PayTypesOptions,
  CustomerType,
} from "../../../Components/CustomDropDown";
import CustomDropDown from "../../../Components/CustomDropDown";
import CustomButton from "../../../Components/Button";
import FormField from "../../../Components/InputField";
import { Card, Col, Row, Select, Image, Spin } from "antd";
import { Images } from "../../../Utils/Images";

const paymentTypes = [
  { label: "Cash", value: "cash" },
  { label: "Online", value: "online" },
];

const validationSchema = Yup.object({
  customers: Yup.string().required("Customer is required"),
  transactionId: Yup.string().when("paymentType", {
    is: "online",
    then: (schema) => schema.required("Transaction ID is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const PlaceDirectOrder: React.FC = () => {
  const token = useToken();

  const [customersList, setCustomersList] = useState<any[]>([]);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [activeSlot, setActiveSlot] = useState<any | null>(null);
  const [loadingSlot, setLoadingSlot] = useState(true);

  console.log(userDetails);
  const {
    values,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    handleChange,
    handleBlur,
    errors,
    touched,
    resetForm,
  } = useFormik({
    initialValues: {
      customers: "",
      morningQuantity: "",
      eveningQuantity: "",
      transactionId: "",
      paymentType: "cash",
    },
    validationSchema,
    onSubmit: async (vals, { setSubmitting }) => {
      if (!token || !userDetails || !activeSlot) return;

      const quantity =
        activeSlot.id === 1
          ? Number(vals.morningQuantity)
          : Number(vals.eveningQuantity);

      const payload = {
        token,
        customer_id: userDetails.user_id,
        quantity,
        is_paid: 1,
        payment_type: vals.paymentType === "cash" ? 1 : 2,
        transaction_id: vals.transactionId || "",
      };

      showLoader();
      try {
        const res = await placeDirectCustomerLog(payload);
        if (res.data.status === 1) {
          toast.success("Order placed successfully!");
          resetForm();
          setUserDetails(null);
        } else {
          toast.error(res.data.msg || "Failed to place order.");
        }
      } catch {
        toast.error("Error placing the order.");
      } finally {
        hideLoader();
        setSubmitting(false);
      }
    },
  });

  const quantity =
    activeSlot?.id === 1
      ? Number(values.morningQuantity)
      : activeSlot?.id === 2
      ? Number(values.eveningQuantity)
      : 0;

  const totalAmount = quantity * (userDetails?.unit_price ?? 0);

  const hasMorning = userDetails?.today_slot_data?.some(
    (s: any) => s.slot_id === 1
  );
  const hasEvening = userDetails?.today_slot_data?.some(
    (s: any) => s.slot_id === 2
  );

  const canPlace =
    (activeSlot?.id === 1 && hasMorning) ||
    (activeSlot?.id === 2 && hasEvening);

  useEffect(() => {
    if (!token) return;
    const fd = new FormData();
    fd.append("token", token);
    getActiveSlot(fd)
      .then((res) => {
        if (res.data.status === 1 && res.data.data?.id) {
          setActiveSlot(res.data.data);
        } else {
          setActiveSlot(null);
        }
      })
      .catch(() => setActiveSlot(null))
      .finally(() => setLoadingSlot(false));
  }, [token]);

  useEffect(() => {
    if (!values.customers) return setUserDetails(null);
    const cust = customersList.find(
      (c) => String(c.user_id) === values.customers
    );
    if (!cust || !token) return setUserDetails(null);

    showLoader();
    const fd = new FormData();
    fd.append("token", token);
    fd.append("user_id", values.customers);
    fetchUserById(fd)
      .then((res) => {
        if (res.data.status === 1) {
          const data = res.data.data || {};
          setUserDetails({ ...data, unit_price: cust.unit_price });
          setFieldValue("morningQuantity", "");
          setFieldValue("eveningQuantity", "");
          (data.today_slot_data || []).forEach((slot: any) => {
            if (slot.slot_id === 1)
              setFieldValue("morningQuantity", slot.quantity);
            if (slot.slot_id === 2)
              setFieldValue("eveningQuantity", slot.quantity);
          });
        } else {
          toast.error(res.data.msg || "Failed to load customer");
          setUserDetails(null);
        }
      })
      .catch(() => {
        toast.error("Error fetching customer");
        setUserDetails(null);
      })
      .finally(() => hideLoader());
  }, [values.customers, customersList, token, setFieldValue]);

  return (
    <div className="container py-3">
      <h4 className="mb-4">Place Direct Order</h4>

      {loadingSlot ? (
        <Spin />
      ) : activeSlot ? (
        <form onSubmit={handleSubmit}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <CustomDropDown
                dropdownKeys={["customers"]}
                formik={{ values, setFieldValue, errors, touched }}
                className="mb-3"
                customerType="1"
                onCustomersLoaded={setCustomersList}
              />
            </Col>
          </Row>

          {userDetails && (
<Card
  title={
    <div className="fs-5 fw-bold text-white bg-primary px-3 py-2 rounded">
      Customer Details ({activeSlot.name})
    </div>
  }
  className="shadow-sm mb-4 border-0"
  bodyStyle={{ backgroundColor: "#f8f9fa", padding: "1.5rem" }} // Bootstrap's light gray
>
  <Row gutter={[16, 16]}>
    <Col xs={24} sm={12} md={8}>
      <div className="bg-white p-3 rounded shadow-sm h-100">
        <label className="fw-semibold text-secondary">Name:</label>
        <p className="mb-0">{userDetails.name || "-"}</p>
      </div>
    </Col>
    <Col xs={24} sm={12} md={8}>
      <div className="bg-white p-3 rounded shadow-sm h-100">
        <label className="fw-semibold text-secondary">Phone:</label>
        <p className="mb-0">{userDetails.phone || "-"}</p>
      </div>
    </Col>
    <Col xs={24} sm={12} md={8}>
      <div className="bg-white p-3 rounded shadow-sm h-100">
        <label className="fw-semibold text-secondary">Email:</label>
        <p className="mb-0">{userDetails.email || "-"}</p>
      </div>
    </Col>
    <Col xs={24} sm={12} md={8}>
      <div className="bg-white p-3 rounded shadow-sm h-100">
        <label className="fw-semibold text-secondary">Line:</label>
        <p className="mb-0">{userDetails.line_name ?? "-"}</p>
      </div>
    </Col>
    <Col xs={24} sm={12} md={8}>
      <div className="bg-white p-3 rounded shadow-sm h-100">
        <label className="fw-semibold text-secondary">Pay Type:</label>
        <p className="mb-0">
          {PayTypesOptions.find((p) => p.value === String(userDetails.pay_type))?.label || "-"}
        </p>
      </div>
    </Col>
    <Col xs={24} sm={12} md={8}>
      <div className="bg-white p-3 rounded shadow-sm h-100">
        <label className="fw-semibold text-secondary">Customer Type:</label>
        <p className="mb-0">
          {CustomerType.find((c) => c.value === userDetails.customer_type)?.label || "-"}
        </p>
      </div>
    </Col>
    <Col xs={24} sm={12} md={8}>
      <div className="bg-white p-3 rounded shadow-sm h-100">
        <label className="fw-semibold text-secondary">Unit Price:</label>
        <p className="mb-0">₹{userDetails.unit_price ?? "-"}</p>
      </div>
    </Col>
  </Row>

  <Row gutter={[16, 16]} className="mt-4">
    <Col span={24}>
      <div className="bg-white p-3 rounded shadow-sm">
        {activeSlot.id === 1 ? (
          hasMorning ? (
            <FormField
              label="Morning Qty"
              name="morningQuantity"
              placeholder="Enter morning quantity"
              type="number"
              value={values.morningQuantity}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.morningQuantity}
              touched={touched.morningQuantity}
            />
          ) : (
            <p className="text-danger fw-semibold mb-0">No Morning Slot</p>
          )
        ) : hasEvening ? (
          <FormField
            label="Evening Qty"
            name="eveningQuantity"
            placeholder="Enter evening quantity"
            type="number"
            value={values.eveningQuantity}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.eveningQuantity}
            touched={touched.eveningQuantity}
          />
        ) : (
          <p className="text-danger fw-semibold mb-0">No Evening Slot</p>
        )}
      </div>
    </Col>
  </Row>

  <div className="mt-4 bg-light p-3 rounded shadow-sm">
    <strong className="me-2">Total:</strong> ₹{totalAmount.toFixed(2)}
  </div>

  {canPlace && (
    <Row gutter={[16, 16]} className="mt-4">
      <Col xs={24} sm={12} md={6}>
        <label className="form-label fw-semibold">Payment Type</label>
        <Select
          value={values.paymentType}
          onChange={(v) => setFieldValue("paymentType", v)}
          options={paymentTypes}
          className="w-100"
        />
      </Col>

      {values.paymentType === "online" && (
        <>
          <Col xs={24}>
            <label className="form-label fw-semibold">Scan QR Code</label>
            <br />
            <Image
              src={Images.QRcode}
              width={200}
              alt="QR"
              className="d-block mb-2 rounded border"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <FormField
              label="Transaction ID"
              name="transactionId"
              placeholder="Enter transaction ID"
              value={values.transactionId}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.transactionId}
              touched={touched.transactionId}
            />
          </Col>
        </>
      )}
    </Row>
  )}
</Card>

          )}

          {canPlace && (
            <CustomButton
              type="submit"
              className="btn btn-success"
              disabled={isSubmitting}
            >
              Place Order
            </CustomButton>
          )}
        </form>
      ) : (
        <div className="alert alert-warning">
          No active inventory slot today.
        </div>
      )}
    </div>
  );
};

export default PlaceDirectOrder;
