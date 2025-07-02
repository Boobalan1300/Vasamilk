import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { ListAssignedSlot } from "../../../Service/ApiServices";
import CustomTable from "../../../Components/CustomTable";
import type { ColumnsType } from "antd/es/table";
import { useLoader } from "../../../Hooks/useLoader";
import { useToken } from "../../../Hooks/UserHook";
import { toast } from "react-toastify";
import CustomButton from "../../../Components/Button";
import { Tag } from "antd";

interface AssignedSlotType {
  id: number;
  assign_type_name: string;
  customer_name: string;
  slot_name: string;
  milk_given_method_name: string;
  quantity: number;
  from_date: string | null;
  to_date: string | null;
  created_at: string;
}

const AssignedSlot = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();

  const {
    lineId,
    lineName,
    distributorId,
    distributorName,
  }: {
    lineId?: number;
    lineName?: string;
    distributorId?: number;
    distributorName?: string;
  } = location.state || {};

  const [assignedSlots, setAssignedSlots] = useState<AssignedSlotType[]>([]);

  useEffect(() => {
    fetchAssignedSlots();
  }, [lineId, distributorId]);

  const fetchAssignedSlots = () => {
    const token = useToken();
    if (!token || !lineId || !distributorId) return;

    const formData = new FormData();
    formData.append("token", token.toString());
    formData.append("line_id", lineId.toString());
    formData.append("distributor_id", distributorId.toString());

    showLoader();
    ListAssignedSlot(1, 50, formData)
      .then((res) => {
        if (res.data.status === 1) {
          setAssignedSlots(res.data.data || []);
        } else {
          toast.error(res.data.msg || "Failed to fetch assigned slots");
        }
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        hideLoader();
      });
  };

  const columns: ColumnsType<AssignedSlotType> = [
    { title: "Customer", dataIndex: "customer_name", key: "customer_name" },
    { title: "Slot", dataIndex: "slot_name", key: "slot_name" },
    {
      title: "Assign Type",
      dataIndex: "assign_type_name",
      key: "assign_type_name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (qty) => `${qty} L`,
    },
    {
      title: "Milk Method",
      dataIndex: "milk_given_method_name",
      key: "milk_given_method_name",
    },
    {
      title: "From - To",
      key: "date_range",
      render: (_, record) =>
        record.from_date && record.to_date
          ? `${record.from_date} to ${record.to_date}`
          : "N/A",
    },
    { title: "Created At", dataIndex: "created_at", key: "created_at" },
  ];

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="mb-2">
            Assigned Slots for Line:
            <Tag color="#007bff" style={{ marginLeft: 8 }}>{lineName}</Tag>
          </h5>
          <h5 className="mb-1">
            Distributor:
            <span style={{ color: "#666f7a" }}> {distributorName} </span>
          </h5>
        </div>

        <CustomButton
          type="button"
          className="btn-grey px-2 py-1"
          onClick={() => navigate(-1)}
        >
          Back
        </CustomButton>
      </div>

      <CustomTable data={assignedSlots} columns={columns} rowKey="id" />
    </div>
  );
};

export default AssignedSlot;
