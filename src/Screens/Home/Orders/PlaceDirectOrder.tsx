import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
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
import { Card, Col, Row, Select, Image } from "antd";
import { Images } from "../../../Utils/Images";

const paymentTypes = [
  { label: "Cash", value: "cash" },
  { label: "Online", value: "online" },
];

const PlaceDirectOrder: React.FC = () => {
  const token = useToken();
  const navigate = useNavigate();

  const [customersList, setCustomersList] = useState<any[]>([]);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [activeSlot, setActiveSlot] = useState<any | null>(null);
  const [loadingSlotStatus, setLoadingSlotStatus] = useState(true);

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
    validationSchema: Yup.object({
      customers: Yup.string().required("Customer is required"),
      transactionId: Yup.string().when("paymentType", {
        is: "online",
        then: (schema) => schema.required("Transaction ID is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      if (!token || !userDetails || !activeSlot?.id) return;

      const quantity =
        (activeSlot.id === 1
          ? Number(values.morningQuantity)
          : Number(values.eveningQuantity)) || 0;

      const payload = {
        token,
        customer_id: userDetails.user_id,
        quantity,
        is_paid: 1,
        payment_type: values.paymentType === "cash" ? 1 : 2,
        transaction_id: values.transactionId || "",
      };

      showLoader();
      try {
        const res = await placeDirectCustomerLog(payload);
        if (res.data.status === 1) {
          toast.success("Direct order placed successfully!");
          resetForm();
          setUserDetails(null);
        } else {
          toast.error(res.data.msg || "Failed to place order.");
        }
      } catch {
        toast.error("Something went wrong while placing the order.");
      } finally {
        hideLoader();
        setSubmitting(false);
      }
    },
  });

  const quantity =
    (activeSlot?.id === 1
      ? Number(values.morningQuantity)
      : activeSlot?.id === 2
      ? Number(values.eveningQuantity)
      : 0) || 0;

  const totalAmount = quantity * (userDetails?.unit_price ?? 0);

  const hasMorningSlotToday =
    userDetails?.today_slot_data?.some((s: any) => s.slot_id === 1) ?? false;
  const hasEveningSlotToday =
    userDetails?.today_slot_data?.some((s: any) => s.slot_id === 2) ?? false;

  const isSlotAvailableForCustomer =
    (activeSlot?.id === 1 && hasMorningSlotToday) ||
    (activeSlot?.id === 2 && hasEveningSlotToday);

  useEffect(() => {
    if (token) {
      fetchActiveSlot(token);
    }
  }, [token]);

  const fetchActiveSlot = (token: string) => {
    setLoadingSlotStatus(true);

    const formData = new FormData();
    formData.append("token", token);

    getActiveSlot(formData)
      .then((res) => {
        if (res.data.status === 1) {
          setActiveSlot(res.data.data);
        } else {
          setActiveSlot(null);
        }
      })
      .catch(() => {
        setActiveSlot(null);
      })
      .finally(() => {
        setLoadingSlotStatus(false);
      });
  };

  useEffect(() => {
    if (values.customers) fetchAndSetCustomerDetails(values.customers);
  }, [values.customers]);

  const fetchAndSetCustomerDetails = (customerId: string) => {
    const selectedCustomer = customersList.find(
      (c) => String(c.user_id) === String(customerId)
    );
    if (!selectedCustomer || !token) {
      setUserDetails(null);
      return;
    }

    showLoader();
    const formData = new FormData();
    formData.append("token", token);
    formData.append("user_id", customerId);

    fetchUserById(formData)
      .then((res) => {
        if (res.data.status === 1) {
          const fetchedData = res.data.data || {};
          setUserDetails({
            ...fetchedData,
            unit_price: selectedCustomer.unit_price,
          });

          setFieldValue("morningQuantity", "");
          setFieldValue("eveningQuantity", "");

          (fetchedData.today_slot_data || []).forEach((slot: any) => {
            if (slot.slot_id === 1)
              setFieldValue("morningQuantity", slot.quantity);
            if (slot.slot_id === 2)
              setFieldValue("eveningQuantity", slot.quantity);
          });
        } else {
          toast.error(res.data.msg || "Failed to fetch customer details");
          setUserDetails(null);
        }
      })
      .catch(() => {
        toast.error("Something went wrong while fetching user details");
        setUserDetails(null);
      })
      .finally(() => hideLoader());
  };

  const renderSlotAlertMessage = () => {
    if (loadingSlotStatus) return null;

    if (!activeSlot?.id) {
      return (
        <div className="alert alert-warning text-center mb-3">
          There is no active inventory slot for today.
        </div>
      );
    }
  };

  return (
    <div className="container py-3">
      <h4 className="mb-4">Place Direct Order</h4>

      {renderSlotAlertMessage()}

      {activeSlot?.id && (
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

            <Col xs={24} className="d-flex justify-content-between mb-2">
              <span
                onClick={() => navigate("/createUser")}
                style={{ cursor: "pointer", color: "#1677ff" }}
              >
                Add New User
              </span>
            </Col>

            {userDetails && (
              <Col xs={24}>
                <Card
                  className="mb-4"
                  title={`Customer Details (${activeSlot.name})`}
                >
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                      <strong>Name:</strong>
                      <p>{userDetails.name || "-"}</p>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <strong>Phone:</strong>
                      <p>{userDetails.phone || "-"}</p>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <strong>Email:</strong>
                      <p>{userDetails.email || "-"}</p>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <strong>Line:</strong>
                      <p>{userDetails.line_name ?? "-"}</p>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <strong>Pay Type:</strong>
                      <p>
                        {PayTypesOptions.find(
                          (p) => p.value === userDetails.pay_type
                        )?.label || "-"}
                      </p>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <strong>Customer Type:</strong>
                      <p>
                        {CustomerType.find(
                          (c) => c.value === userDetails.customer_type
                        )?.label || "-"}
                      </p>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <strong>Unit Price:</strong>
                      <p>Rs.{userDetails.unit_price ?? "-"}</p>
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]}>
                    {activeSlot.id === 1 && (
                      <Col xs={24} sm={12}>
                        {hasMorningSlotToday ? (
                          <FormField
                            label="Morning Quantity"
                            type="number"
                            name="morningQuantity"
                            value={values.morningQuantity}
                            placeholder="Enter morning quantity"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.morningQuantity}
                            touched={touched.morningQuantity}
                          />
                        ) : (
                          <p className="text-danger">
                            No Morning Slot Available for this customer
                          </p>
                        )}
                      </Col>
                    )}
                    {activeSlot.id === 2 && (
                      <Col xs={24} sm={12}>
                        {hasEveningSlotToday ? (
                          <FormField
                            label="Evening Quantity"
                            type="number"
                            name="eveningQuantity"
                            value={values.eveningQuantity}
                            placeholder="Enter evening quantity"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.eveningQuantity}
                            touched={touched.eveningQuantity}
                          />
                        ) : (
                          <p className="text-danger">
                            No Evening Slot Available for this customer
                          </p>
                        )}
                      </Col>
                    )}
                  </Row>

                  {quantity > 0 && (
                    <Row className="mt-3">
                      <Col>
                        <strong>Total Amount:</strong> ₹{totalAmount.toFixed(2)}
                      </Col>
                    </Row>
                  )}

                  {isSlotAvailableForCustomer && (
                    <Row gutter={[16, 16]} className="mt-3">
                      <Col xs={24} sm={12}>
                        <label className="form-label">Payment Type</label>
                        <Select
                          value={values.paymentType}
                          onChange={(val) => setFieldValue("paymentType", val)}
                          style={{ width: "100%" }}
                          options={paymentTypes}
                        />
                      </Col>

                      {values.paymentType === "online" && (
                        <>
                          <Col xs={24}>
                            <label className="form-label">Scan QR Code</label>
                            <br />
                            <Image
                              width={200}
                              src={Images.QRcode}
                              alt="QR Code"
                            />
                          </Col>
                          <Col xs={24} sm={12}>
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
              </Col>
            )}

            {isSlotAvailableForCustomer && (
              <Col xs={24}>
                <CustomButton
                  type="submit"
                  className="btn btn-success"
                  disabled={isSubmitting}
                >
                  Place Order
                </CustomButton>
              </Col>
            )}
          </Row>
        </form>
      )}
    </div>
  );
};

export default PlaceDirectOrder;
