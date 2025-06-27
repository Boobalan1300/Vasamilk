import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { getDecryptedCookie } from "../../../Utils/Cookie";
import { AddInventory as addInventoryApi } from "../../../Service/ApiServices";

const AddInventory = () => {
  const formik = useFormik({
    initialValues: {
      total_quantity: "",
    },
    validationSchema: Yup.object({
      total_quantity: Yup.number()
        .typeError("Quantity must be a number")
        .required("Total quantity is required")
        .positive("Quantity must be positive"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const decrypted = getDecryptedCookie("user_data") || "";
        const { token } = JSON.parse(decrypted);

        const formData = new FormData();
        formData.append("token", token);
        formData.append("total_quantity", values.total_quantity);

        const res = await addInventoryApi(formData);

        if (res.data.status === 1) {
          toast.success(res.data.msg || "Inventory added successfully");
          resetForm();
        } else {
          toast.error(res.data.msg || "Failed to add inventory");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = formik;

  return (
    <div className="container mt-4">
      <h4>Add Inventory</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Total Quantity</label>
          <input
            type="number"
            name="total_quantity"
            className={`form-control ${touched.total_quantity && errors.total_quantity ? "is-invalid" : ""}`}
            value={values.total_quantity}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter quantity"
          />
          {touched.total_quantity && errors.total_quantity && (
            <div className="invalid-feedback">{errors.total_quantity}</div>
          )}
        </div>

        <div className="text-end">
          <button className="btn btn-primary" type="submit">
            Add Inventory
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInventory;
