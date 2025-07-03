import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { UpdateInventory, GetInventoryList } from "../Service/ApiServices";
import { useToken } from "../Hooks/UserHook";
import FormField from "../Components/InputField";
import CustomModal from "../Components/CustomModal";
import CustomButton from "../Components/Button";

interface UpdateInventoryFormProps {
  visible: boolean;
  inventoryId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const updateInventoryValidationSchema = Yup.object({
  total_quantity: Yup.number()
    .required("Total quantity is required")
    .min(1, "Must be at least 1"),
  comment: Yup.string().required("Comment is required"),
});

const UpdateInventoryForm = ({
  visible,
  inventoryId,
  onClose,
  onSuccess,
}: UpdateInventoryFormProps) => {
  const token = useToken();
  const [initialValues, setInitialValues] = useState({
    inventory_id: inventoryId,
    total_quantity: "",
    comment: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchInventoryData = () => {
    if (!token) {
      toast.error("Authentication token missing");
      setLoading(false);
      return;
    }

    GetInventoryList({
      token,
      page: 1,
      size: 100,
    })
      .then((res) => {
        if (res?.data?.status === 1) {
          const item = res.data.data.find((inv: any) => inv.id === inventoryId);
          if (item) {
            setInitialValues({
              inventory_id: inventoryId,
              total_quantity: String(item.total_quantity || ""),
              comment: item.comment || "",
            });
          }
        } else {
          toast.error("Failed to fetch inventory details");
        }
      })
      .catch(() => {
        toast.error("Something went wrong while fetching inventory details");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (visible) fetchInventoryData();
  }, [inventoryId, token, visible]);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: updateInventoryValidationSchema,
    onSubmit: (values, { setSubmitting }) => {
      handleUpdateInventory(values, setSubmitting);
    },
  });

  const handleUpdateInventory = (
    values: {
      inventory_id: number;
      total_quantity: string;
      comment: string;
    },
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    if (!token) {
      toast.error("Authentication token missing");
      setSubmitting(false);
      return;
    }

    const form = new FormData();
    form.append("token", token);
    form.append("inventory_id", String(values.inventory_id));
    form.append("total_quantity", values.total_quantity);
    form.append("comment", values.comment);

    UpdateInventory(form)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success("Inventory updated successfully");
          onSuccess();
          onClose();
        } else {
          toast.error("Failed to update inventory");
        }
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <CustomModal
      open={visible}
      onCancel={onClose}
      footer={null}
      title="Update Inventory"
    >
      <form onSubmit={handleSubmit} className="p-3">
        <div className="mb-3">
          <FormField
            label="Total Quantity *"
            type="number"
            name="total_quantity"
            value={values.total_quantity}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter total quantity"
            error={errors.total_quantity}
            touched={touched.total_quantity}
          />
        </div>

        <div className="mb-3">
          <FormField
            label="Comment *"
            type="text"
            name="comment"
            value={values.comment}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter comment"
            error={errors.comment}
            touched={touched.comment}
          />
        </div>

        <CustomButton
          type="submit"
          className="btn btn-sm btn-submit"
          disabled={isSubmitting || loading}
        >
          {isSubmitting ? "Updating..." : "Update Inventory"}
        </CustomButton>
      </form>
    </CustomModal>
  );
};

export default UpdateInventoryForm;
