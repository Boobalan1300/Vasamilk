

// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { message } from "antd";
// import { getUser } from "../Utils/Cookie";
// import { UpdateInventory } from "../Service/ApiServices";

// const UpdateInventoryForm = ({
//   inventoryId,
//   onSuccess,
// }: {
//   inventoryId: number;
//   onSuccess: () => void;
// }) => {

//   const handleUpdateInventory = async (
//     values: {
//       token: string;
//       inventory_id: number;
//       total_quantity: string;
//       comment: string;
//     },
//     setSubmitting: (isSubmitting: boolean) => void
//   ) => {
//     const form = new FormData();
//     form.append("token", values.token);
//     form.append("inventory_id", String(values.inventory_id));
//     form.append("total_quantity", values.total_quantity);
//     form.append("comment", values.comment);

//     try {
//       const res = await UpdateInventory(form);
//       console.log(res);
//       if (res.data.status === 1) {
//         message.success("updated successfully");
//         onSuccess();
//       } else {
//         message.error(res.data.msg || "Failed to update inventory");
//       }
//     } catch (error) {
//       message.error("Something went wrong");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const {
//     values,
//     errors,
//     touched,
//     handleChange,
//     handleBlur,
//     handleSubmit,
//     isSubmitting,
//   } = useFormik({
//     initialValues: {
//       token: getUser()?.token || "",
//       inventory_id: inventoryId,
//       total_quantity: "",
//       comment: "",
//     },
//     validationSchema: Yup.object({
//       total_quantity: Yup.number()
//         .required("Total quantity is required")
//         .min(1, "Must be at least 1"),
//       comment: Yup.string().required("Comment is required"),
//     }),
//     onSubmit: (values, { setSubmitting }) => {
//       handleUpdateInventory(values, setSubmitting);
//     },
//   });

//   return (
//     <form onSubmit={handleSubmit} className="p-3">
//       <div className="mb-3">
//         <label>Total Quantity</label>
//         <input
//           type="number"
//           name="total_quantity"
//           className={`form-control ${
//             touched.total_quantity && errors.total_quantity ? "is-invalid" : ""
//           }`}
//           onChange={handleChange}
//           onBlur={handleBlur}
//           value={values.total_quantity}
//         />
//         {touched.total_quantity && errors.total_quantity && (
//           <div className="invalid-feedback">{errors.total_quantity}</div>
//         )}
//       </div>

//       <div className="mb-3">
//         <label>Comment</label>
//         <textarea
//           name="comment"
//           className={`form-control ${
//             touched.comment && errors.comment ? "is-invalid" : ""
//           }`}
//           onChange={handleChange}
//           onBlur={handleBlur}
//           value={values.comment}
//         />
//         {touched.comment && errors.comment && (
//           <div className="invalid-feedback">{errors.comment}</div>
//         )}
//       </div>

//       <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
//         {isSubmitting ? "Updating..." : "Update Inventory"}
//       </button>
//     </form>
//   );
// };

// export default UpdateInventoryForm;

import { useFormik } from "formik";
import * as Yup from "yup";
import { message } from "antd";
import { getUser } from "../Utils/Cookie";
import { UpdateInventory, GetInventoryList } from "../Service/ApiServices";
import { useEffect, useState } from "react";

const UpdateInventoryForm = ({
  inventoryId,
  onSuccess,
}: {
  inventoryId: number;
  onSuccess: () => void;
}) => {
  const [initialValues, setInitialValues] = useState({
    token: getUser()?.token || "",
    inventory_id: inventoryId,
    total_quantity: "",
    comment: "",
  });

  const [loading, setLoading] = useState(true);

  const fetchInventoryData = async () => {
    try {
      const user = getUser();
      const listFormData = new FormData();
      listFormData.append("token", user?.token || "");
      listFormData.append("page", "1");
      listFormData.append("size", "100");
      const res = await GetInventoryList({
        token: user?.token || "",
        page: 1,
        size: 100,
      });

      if (res?.data?.status === 1) {
        const item = res.data.data.find((inv: any) => inv.id === inventoryId);
        if (item) {
          setInitialValues({
            token: user?.token || "",
            inventory_id: inventoryId,
            total_quantity: String(item.total_quantity || ""),
            comment: item.comment || "",
          });
        }
      } else {
        message.error(res?.data?.msg || "Failed to fetch inventory details");
      }
    } catch (err) {
      message.error("Something went wrong while fetching inventory details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, [inventoryId]);

  const handleUpdateInventory = async (
    values: {
      token: string;
      inventory_id: number;
      total_quantity: string;
      comment: string;
    },
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const form = new FormData();
    form.append("token", values.token);
    form.append("inventory_id", String(values.inventory_id));
    form.append("total_quantity", values.total_quantity);
    form.append("comment", values.comment);

    try {
      const res = await UpdateInventory(form);
      if (res.data.status === 1) {
        message.success("Inventory updated successfully");
        onSuccess();
      } else {
        message.error(res.data.msg || "Failed to update inventory");
      }
    } catch (error) {
      message.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object({
      total_quantity: Yup.number()
        .required("Total quantity is required")
        .min(1, "Must be at least 1"),
      comment: Yup.string().required("Comment is required"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      handleUpdateInventory(values, setSubmitting);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="p-3">
      <div className="mb-3">
        <label>
          Total Quantity <span className="text-danger">*</span>
        </label>
        <input
          type="number"
          name="total_quantity"
          className={`form-control ${
            formik.touched.total_quantity && formik.errors.total_quantity ? "is-invalid" : ""
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.total_quantity}
        />
        {formik.touched.total_quantity && formik.errors.total_quantity && (
          <div className="invalid-feedback">{formik.errors.total_quantity}</div>
        )}
      </div>

      <div className="mb-3">
        <label>
          Comment <span className="text-danger">*</span>
        </label>
        <textarea
          name="comment"
          className={`form-control ${
            formik.touched.comment && formik.errors.comment ? "is-invalid" : ""
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.comment}
        />
        {formik.touched.comment && formik.errors.comment && (
          <div className="invalid-feedback">{formik.errors.comment}</div>
        )}
      </div>

      <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting || loading}>
        {formik.isSubmitting ? "Updating..." : "Update Inventory"}
      </button>
    </form>
  );
};

export default UpdateInventoryForm;
