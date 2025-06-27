
// import { useEffect, useState } from "react";
// import { Modal, Select, InputNumber, notification, Spin, Form } from "antd";
// import { getUser } from "../Utils/Cookie";
// import {
//   AddDistributorInventoryLog,
//   GetDistributorWithLines,
// } from "../Service/ApiServices";
// import { useFormik } from "formik";
// import * as Yup from "yup";

// const { Option } = Select;

// interface Props {
//   visible: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// const AddDistributorLogModal = ({ visible, onClose, onSuccess }: Props) => {
//   const [distributors, setDistributors] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [formLoading, setFormLoading] = useState(false);

//   useEffect(() => {
//     if (visible) {
//       fetchDistributors();
//     }
//   }, [visible]);

//   const fetchDistributors = async () => {
//     const token = getUser()?.token;
//     if (!token) return;

//     const formData = new FormData();
//     formData.append("token", token);

//     setLoading(true);
//     try {
//       const res = await GetDistributorWithLines(formData);
//       if (res.data.status === 1) {
//         setDistributors(res.data.data);
//       } else {
//         notification.error({
//           message: "Fetch Failed",
//           description: res.data.msg || "Failed to fetch distributors",
//         });
//       }
//     } catch {
//       notification.error({
//         message: "Fetch Error",
//         description: "Error fetching distributors",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const {
//     values,
//     errors,
//     touched,
//     handleSubmit,
//     setFieldValue,
//     setFieldTouched,
//     resetForm,
//   } = useFormik({
//     initialValues: {
//       distributer_id: "",
//       given_qty: 1,
//       type: "",
//     },
//     validationSchema: Yup.object({
//       distributer_id: Yup.string().required("Distributor is required"),
//       given_qty: Yup.number()
//         .min(1, "Minimum quantity is 1")
//         .required("Quantity is required"),
//       type: Yup.number().required("Type is required"),
//     }),
//     validateOnChange: false,
//     validateOnBlur: true,
//     onSubmit: async (values) => {
//       const token = getUser()?.token;
//       if (!token) return;

//       const formData = new FormData();
//       formData.append("token", token);
//       formData.append("distributer_id", values.distributer_id);
//       formData.append("given_qty", String(values.given_qty));
//       formData.append("type", String(values.type)); // 1 = In, 2 = Out

//       setFormLoading(true);
//       try {
//         const res = await AddDistributorInventoryLog(formData);
//         if (res.data.status === 1) {
//           notification.success({
//             message: "Log Added",
//             description: "Distributor log added successfully",
//           });
//           resetForm();
//           onSuccess();
//           onClose();
//         } else {
//           notification.error({
//             message: "Add Failed",
//             description: res.data.msg || "Failed to add log",
//           });
//         }
//       } catch {
//         notification.error({
//           message: "Submit Error",
//           description: "Something went wrong while submitting",
//         });
//       } finally {
//         setFormLoading(false);
//       }
//     },
//   });

//   return (
//     <Modal
//       title="Add Distributor Log"
//       open={visible}
//       onCancel={onClose}
//       footer={null}
//       destroyOnClose
//     >
//       {loading ? (
//         <Spin />
//       ) : (
//         <form onSubmit={handleSubmit}>
//           <Form layout="vertical">
//             <Form.Item
//               label="Distributor"
//               validateStatus={
//                 touched.distributer_id && errors.distributer_id ? "error" : ""
//               }
//               help={touched.distributer_id && errors.distributer_id}
//             >
//               <Select
//                 placeholder="Select distributor"
//                 value={values.distributer_id}
//                 onChange={(value) => setFieldValue("distributer_id", value)}
//                 onBlur={() => setFieldTouched("distributer_id", true)}
//               >
//                 {distributors.map((dist) => (
//                   <Option key={dist.distributer_id} value={String(dist.distributer_id)}>
//                     {dist.distributer_name}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>

//             <Form.Item
//               label="Quantity (L)"
//               validateStatus={
//                 touched.given_qty && errors.given_qty ? "error" : ""
//               }
//               help={touched.given_qty && errors.given_qty}
//             >
//               <InputNumber
//                 min={1}
//                 style={{ width: "100%" }}
//                 value={values.given_qty}
//                 onChange={(value) => setFieldValue("given_qty", value)}
//                 onBlur={() => setFieldTouched("given_qty", true)}
//               />
//             </Form.Item>

//             <Form.Item
//               label="Type"
//               validateStatus={touched.type && errors.type ? "error" : ""}
//               help={touched.type && errors.type}
//             >
//               <Select
//                 placeholder="Select type"
//                 value={values.type}
//                 onChange={(value) => setFieldValue("type", value)}
//                 onBlur={() => setFieldTouched("type", true)}
//               >
//                 <Option value={1}>In</Option>
//                 <Option value={2}>Out</Option>
//               </Select>
//             </Form.Item>
//           </Form>

//           <div
//             style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}
//           >
//             <button
//               type="button"
//               onClick={onClose}
//               style={{ marginRight: 8 }}
//               className="ant-btn"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="ant-btn ant-btn-primary"
//               disabled={formLoading}
//             >
//               {formLoading ? "Submitting..." : "Submit"}
//             </button>
//           </div>
//         </form>
//       )}
//     </Modal>
//   );
// };

// export default AddDistributorLogModal;




import { useEffect, useState } from "react";
import { Modal, Select, InputNumber, notification, Spin, Form } from "antd";
import { getUser } from "../Utils/Cookie";
import {
  AddDistributorInventoryLog,
  GetDistributorWithLines,
} from "../Service/ApiServices";
import { useFormik } from "formik";
import * as Yup from "yup";

const { Option } = Select;

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddDistributorLogModal = ({ visible, onClose, onSuccess }: Props) => {
  const [distributors, setDistributors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchDistributors();
    }
  }, [visible]);

  const fetchDistributors = async () => {
    const token = getUser()?.token;
    if (!token) return;

    const formData = new FormData();
    formData.append("token", token);

    setLoading(true);
    try {
      const res = await GetDistributorWithLines(formData);
      if (res.data.status === 1) {
        setDistributors(res.data.data);
      } else {
        notification.error({
          message: "Fetch Failed",
          description: res.data.msg || "Failed to fetch distributors",
        });
      }
    } catch {
      notification.error({
        message: "Fetch Error",
        description: "Error fetching distributors",
      });
    } finally {
      setLoading(false);
    }
  };

  const {
    values,
    errors,
    touched,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    resetForm,
  } = useFormik({
    initialValues: {
      distributer_id: "",
      given_qty: 1,
      type: "",
    },
    validationSchema: Yup.object({
      distributer_id: Yup.string().required("Distributor is required"),
      given_qty: Yup.number()
        .min(1, "Minimum quantity is 1")
        .required("Quantity is required"),
      type: Yup.number().required("Type is required"),
    }),
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      const token = getUser()?.token;
      if (!token) return;

      const formData = new FormData();
      formData.append("token", token);
      formData.append("distributer_id", values.distributer_id);
      formData.append("given_qty", String(values.given_qty));
      formData.append("type", String(values.type));

      setFormLoading(true);
      try {
        const res = await AddDistributorInventoryLog(formData);
        if (res.data.status === 1) {
          notification.success({
            message: "Log Added",
            description: "Distributor log added successfully",
          });
          resetForm();
          onSuccess();
          onClose();
        } else {
          notification.error({
            message: "Add Failed",
            description: res.data.msg || "Failed to add log",
          });
        }
      } catch {
        notification.error({
          message: "Submit Error",
          description: "Something went wrong while submitting",
        });
      } finally {
        setFormLoading(false);
      }
    },
  });

  return (
    <Modal
      title="Add Distributor Log"
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      {loading ? (
        <Spin />
      ) : (
        <form onSubmit={handleSubmit}>
          <Form layout="vertical">
            <Form.Item
              label="Distributor"
              validateStatus={
                touched.distributer_id && errors.distributer_id ? "error" : ""
              }
              help={touched.distributer_id && errors.distributer_id}
            >
              <Select
                showSearch
                placeholder="Select distributor"
                value={values.distributer_id}
                onChange={(value) => setFieldValue("distributer_id", value)}
                onBlur={() => setFieldTouched("distributer_id", true)}
                filterOption={(input, option) => {
                  const label = option?.children?.toString().toLowerCase() || "";
                  return label.includes(input.toLowerCase());
                }}
              >
                {distributors.map((dist) => (
                  <Option key={dist.distributer_id} value={String(dist.distributer_id)}>
                    {dist.distributer_name} - {dist.phone_number}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Quantity (L)"
              validateStatus={
                touched.given_qty && errors.given_qty ? "error" : ""
              }
              help={touched.given_qty && errors.given_qty}
            >
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                value={values.given_qty}
                onChange={(value) => setFieldValue("given_qty", value)}
                onBlur={() => setFieldTouched("given_qty", true)}
              />
            </Form.Item>

            <Form.Item
              label="Type"
              validateStatus={touched.type && errors.type ? "error" : ""}
              help={touched.type && errors.type}
            >
              <Select
                placeholder="Select type"
                value={values.type}
                onChange={(value) => setFieldValue("type", value)}
                onBlur={() => setFieldTouched("type", true)}
              >
                <Option value={1}>In</Option>
                <Option value={2}>Out</Option>
              </Select>
            </Form.Item>
          </Form>

          <div
            style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{ marginRight: 8 }}
              className="ant-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ant-btn ant-btn-primary"
              disabled={formLoading}
            >
              {formLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default AddDistributorLogModal;
