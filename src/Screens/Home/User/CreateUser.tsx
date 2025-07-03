import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { useToken } from "../../../Hooks/UserHook";
import {
  fetchUserById,
  handleCreateUser,
  handleEditUser,
} from "../../../Service/ApiServices";
import FormField from "../../../Components/InputField";
import CustomDropDown from "../../../Components/CustomDropDown";
import CustomButton from "../../../Components/Button";
import { Select } from "antd";
const { Option } = Select;

interface SlotEntry {
  id?: number;
  slot_id: number;
  quantity: string;
  method: string;
  start_date: string;
}
interface FormValues {
  name: string;
  user_name: string;
  email: string;
  phone: string;
  alternative_number: string;
  password: string;
  user_type: string;
  customer_type: string;
  line_id: string;
  price_tag_id: string;
  pay_type: string;
  slot_data: SlotEntry[];
}

const getValidationSchema = (isEdit: boolean) =>
  Yup.object({
    name: Yup.string().required("Required"),
    user_name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid").required("Required"),
    phone: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number")
      .required("Required"),
    alternative_number: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number")
      .notRequired(),
    password: isEdit
      ? Yup.string().notRequired()
      : Yup.string().required("Required"),
    user_type: Yup.string().required("Required"),
    customer_type: Yup.string().when("user_type", {
      is: "5",
      then: (schema) => schema.required("Customer type is required"),
    }),
    line_id: Yup.string().when("user_type", {
      is: "5",
      then: (schema) => schema.required("Line is required"),
    }),
    price_tag_id: Yup.string().when("user_type", {
      is: "5",
      then: (schema) => schema.required("Price Tag is required"),
    }),
    pay_type: Yup.string().when("user_type", {
      is: "5",
      then: (schema) => schema.required("Pay Type is required"),
    }),
    slot_data: Yup.array().when(["user_type", "customer_type"], {
      is: (user_type: string, customer_type: string) =>
        user_type === "5" && customer_type === "1",
      then: () =>
        Yup.array()
          .of(
            Yup.object().shape({
              slot_id: Yup.number().required("Slot ID required"),
              quantity: Yup.string().notRequired(),
              method: Yup.string().notRequired(),
              start_date: Yup.string().notRequired(),
            })
          )
          .test(
            "at-least-one-slot",
            "At least one slot with quantity and method is required",
            (slots) =>
              Array.isArray(slots) &&
              slots.some(
                (slot) =>
                  !!slot.quantity?.trim() && !!slot.method?.toString().trim()
              )
          ),
      otherwise: () => Yup.mixed().notRequired(),
    }),
  });

const CreateUser = () => {
  const token = useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;
  const isEdit = !!id;

  const [error, setError] = useState<string | null>(null);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setValues,
  } = useFormik<FormValues>({
    initialValues: {
      name: "",
      user_name: "",
      email: "",
      phone: "",
      alternative_number: "",
      password: "",
      user_type: "",
      customer_type: "",
      line_id: "",
      price_tag_id: "",
      pay_type: "",
      slot_data: [
        { slot_id: 1, quantity: "", method: "", start_date: "" },
        { slot_id: 2, quantity: "", method: "", start_date: "" },
      ],
    },
    validationSchema: getValidationSchema(isEdit),
    onSubmit: (values) => {
      submitUserForm(values);
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const submitUserForm = (values: FormValues) => {
    const token = useToken();

    const isCustomer = values.user_type === "5";
    const isRegularCustomer = isCustomer && values.customer_type === "1";

    const morningSlot = values.slot_data?.[0] || {};
    const eveningSlot = values.slot_data?.[1] || {};

    const slotData = isRegularCustomer
      ? [
          ...(morningSlot.quantity &&
          morningSlot.method &&
          morningSlot.start_date
            ? [
                {
                  id: morningSlot.id,
                  slot_id: morningSlot.slot_id,
                  quantity: parseFloat(morningSlot.quantity),
                  method: parseInt(morningSlot.method, 10),
                  start_date: morningSlot.start_date,
                },
              ]
            : []),
          ...(eveningSlot.quantity && eveningSlot.method
            ? [
                {
                  id: eveningSlot.id,
                  slot_id: eveningSlot.slot_id,
                  quantity: parseFloat(eveningSlot.quantity),
                  method: parseInt(eveningSlot.method, 10),
                  start_date: morningSlot.start_date,
                },
              ]
            : []),
        ]
      : [];

    const payload: any = {
      token,

      ...(values.name && { name: values.name }),
      ...(values.user_name && { user_name: values.user_name }),
      ...(values.email && { email: values.email }),
      ...(values.phone && { phone: values.phone }),
      ...(values.alternative_number && {
        alternative_number: values.alternative_number,
      }),
      ...(values.user_type && { user_type: parseInt(values.user_type) }),

      ...(isEdit && id ? { id: parseInt(id) } : { password: values.password }),

      ...(isCustomer && {
        customer_type: parseInt(values.customer_type),
        line_id: parseInt(values.line_id),
        price_tag_id: parseInt(values.price_tag_id),
        pay_type: parseInt(values.pay_type),
        ...(isRegularCustomer && { slot_data: slotData }),
      }),
    };

    console.log("payload", payload);

    const request = isEdit ? handleEditUser : handleCreateUser;

    request(payload)
      .then((response) => {
        if (response?.data?.status === 1) {
          toast.success(response.data.msg);
          navigate("/userManagement");
          resetForm();
        } else {
          toast.error(response.data.msg || "Something went wrong");
        }
      })
      .catch((err) => {
        console.error("Submit error:", err);
        toast.error(isEdit ? "Failed to update user" : "Failed to create user");
      });
  };

  useEffect(() => {
    if (id && token) {
      loadUserDetails(id, token);
    }
  }, [id, token]);

  const loadUserDetails = (id: string, token: string) => {
    const formData = new FormData();
    formData.append("token", token);
    formData.append("user_id", id);

    fetchUserById(formData)
      .then((res) => {
        const data = res.data.data;
        console.log(data);

        setValues({
          name: data.name || "",
          user_name: data.user_name || "",
          email: data.email || "",
          phone: data.phone || "",
          alternative_number: data.alternative_number || "",
          user_type: String(data.user_type || ""),
          customer_type: String(data.customer_type || ""),
          line_id: String(data.line_name || ""),
          price_tag_id: String(data.price_tag_name || ""),
          pay_type: data.pay_type != null ? String(data.pay_type) : "",
          slot_data: data.slot_data || [
            { slot_id: 1, quantity: "", method: "", start_date: "" },
            { slot_id: 2, quantity: "", method: "", start_date: "" },
          ],
          password: "",
        });
      })
      .catch(() => setError("Failed to fetch user details"));
  };

  const methodOptions = [
    { label: "Direct", value: 1 },
    { label: "Distributor", value: 2 },
  ];

  const renderSlotField = (index: number, label: string) => (
    <>
      <h5>{label}</h5>

      <div className="row">
        <div className="col-md-4 mb-3">
          <FormField
            label="Quantity"
            placeholder="quantity"
            name={`slot_data[${index}].quantity`}
            type="number"
            value={values.slot_data[index]?.quantity || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            error={(errors.slot_data?.[index] as any)?.quantity}
            touched={(touched.slot_data?.[index] as any)?.quantity}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label>Method</label>
          <Select
            allowClear
            value={values.slot_data[index]?.method || undefined}
            onChange={(val) => setFieldValue(`slot_data[${index}].method`, val)}
            placeholder="Select method"
            className="w-100"
          >
            {methodOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </div>
        {index === 0 && (
          <div className="col-md-4 mb-3">
            <FormField
              placeholder="start date"
              label="Start Date"
              name={`slot_data[${index}].start_date`}
              type="date"
              value={values.slot_data[index]?.start_date || ""}
              onChange={(e) => {
                handleChange(e);

                setFieldValue(`slot_data[1].start_date`, e.target.value);
              }}
              onBlur={handleBlur}
              error={(errors.slot_data?.[index] as any)?.start_date}
              touched={(touched.slot_data?.[index] as any)?.start_date}
            />
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="container mt-4">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{isEdit ? "EDIT USER" : "ADD USER"}</h2>

        <CustomButton
          type="button"
          className="btn-grey px-2 py-1"
          onClick={() => navigate(-1)}
        >
          Back
        </CustomButton>
      </div>

      <div className="d-flex justify-content-between mb-3"></div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <FormField
              placeholder="name"
              label="Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
            />
          </div>
          <div className="col-md-6 mb-3">
            <FormField
              placeholder="username"
              label="Username"
              name="user_name"
              value={values.user_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.user_name}
              touched={touched.user_name}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <FormField
              placeholder="email"
              label="Email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
            />
          </div>
          <div className="col-md-6 mb-3">
            <FormField
              placeholder="phone"
              label="Phone"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.phone}
              touched={touched.phone}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <FormField
              placeholder="alternative number"
              label="Alternative Number"
              name="alternative_number"
              value={values.alternative_number}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.alternative_number}
              touched={touched.alternative_number}
            />
          </div>
          {!isEdit && (
            <div className="col-md-6 mb-3">
              <FormField
                placeholder="password"
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
                touched={touched.password}
              />
            </div>
          )}
        </div>

        <CustomDropDown
          dropdownKeys={["user_type"]}
          formik={{ values, setFieldValue, handleBlur, touched, errors }}
          className="col-12 col-md-6 mb-3"
        />

        {values.user_type === "5" && (
          <>
            <div className="row">
              <CustomDropDown
                dropdownKeys={[
                  "customer_type",
                  "line_id",
                  "price_tag_id",
                  "pay_type",
                ]}
                formik={{
                  values,
                  setFieldValue,
                  handleBlur,
                  touched,
                  errors,
                }}
              />
            </div>

            {values.customer_type === "1" && (
              <>
                {renderSlotField(0, "Morning Slot")}
                {renderSlotField(1, "Evening Slot")}
                {errors.slot_data && typeof errors.slot_data === "string" && (
                  <div className="text-danger mb-3">{errors.slot_data}</div>
                )}
              </>
            )}
          </>
        )}

        <div className="text-end mt-3">
          <button className="btn btn-primary" type="submit">
            {id ? "Update" : "Create"} User
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
