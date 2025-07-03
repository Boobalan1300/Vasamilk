import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useToken } from "../../../Hooks/UserHook";
import { GetSlotMapping } from "../../../Service/ApiServices";
import CustomTable from "../../../Components/CustomTable";
import CustomPagination from "../../../Components/CustomPagination";
import CustomButton from "../../../Components/Button";
import type { ColumnsType } from "antd/es/table";

import { TODAY } from "../../../Utils/Data/constants";

interface SlotMappingRecord {
  slot_log_id: number;
  customer_id: number;
  customer_name: string;
  assigned_to: number;
  assigned_name: string;
  slot_id: number;
  slot_name: string;
  milk_given_id: number;
  milk_given_type: string;
  scheduled_date: string;
  milk_given_status: string;
  milk_given_quantity: number;
  actual_milk_quantity: number;
  status: number;
  reason: string | null;
  user_pay_mode: number;
  unit_price: string;
  is_assigned: string;
}

const SlotMappingList = () => {
  const token = useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState<SlotMappingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { slotId, givenType } = location.state || {};

  useEffect(() => {
    if (token) fetchData(token, pagination.current, pagination.pageSize);
  }, [token, pagination.current, pagination.pageSize]);

  const fetchData = (token: string, page = 1, size = 10) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("token", token);

    const fromDate = TODAY.format("YYYY-MM-DD");
    formData.append("from_date", fromDate);

    if (slotId) formData.append("slot_id", slotId.toString());
    if (givenType) formData.append("mode", givenType.toString());

    GetSlotMapping(formData, page, size)
      .then((res) => {
        const { data: resultData, total } = res.data;
        setData(resultData || []);
        setPagination((prev) => ({ ...prev, total: total || 0 }));
      })
      .catch(() => toast.error("Failed to fetch slot mappings"))
      .finally(() => setLoading(false));
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, current: page, pageSize }));
  };

  const getTitle = () => {
    let slotLabel = "";
    let whoLabel = "";

    if (slotId === 1) slotLabel = "Morning";
    else if (slotId === 2) slotLabel = "Evening";
    else slotLabel = "Unknown Slot";

    if (givenType === 1) whoLabel = "Vendor";
    else if (givenType === 2) whoLabel = "Distributor";
    else whoLabel = "Unknown";

    return `${slotLabel} - ${whoLabel} Slot Mappings`;
  };

  const columns: ColumnsType<SlotMappingRecord> = [
    {
      title: "S. No.",
      key: "serial",
      render: (_text, _record, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Slot Name",
      dataIndex: "slot_name",
      key: "slot_name",
    },
    {
      title: "Customer",
      dataIndex: "customer_name",
      key: "customer_name",
    },
    {
      title: "Distributor",
      dataIndex: "assigned_name",
      key: "assigned_name",
    },
    {
      title: "Scheduled Date",
      dataIndex: "scheduled_date",
      key: "scheduled_date",
    },
    {
      title: "Given Status",
      dataIndex: "milk_given_status",
      key: "milk_given_status",
      render: (text: string) => (
        <span style={{ color: text === "Missed" ? "red" : "green" }}>
          {text}
        </span>
      ),
    },
    {
      title: "Given Qty",
      dataIndex: "milk_given_quantity",
      key: "milk_given_quantity",
    },
    {
      title: "Actual Qty",
      dataIndex: "actual_milk_quantity",
      key: "actual_milk_quantity",
    },
    {
      title: "Unit Price",
      dataIndex: "unit_price",
      key: "unit_price",
      render: (val: number) => `₹${val}`,
    },
    {
      title: "Pay Mode",
      dataIndex: "user_pay_mode",
      key: "user_pay_mode",
      render: (mode: number) =>
        mode === 1 ? "Prepaid" : mode === 2 ? "Postpaid" : "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: number) => (status === 1 ? "Active" : "Inactive"),
    },
  ];

  return (
    <>
      <div className="d-flex justify-content-between align-items-center my-4">
        <h4 className="">{getTitle()}</h4>
        <CustomButton
          className="btn-grey px-2 py-1"
          onClick={() => navigate(-1)}
        >
          Back
        </CustomButton>
      </div>

      <CustomTable
        columns={columns}
        data={data}
        loading={loading}
        rowKey="slot_log_id"
      />
      <div className="d-flex justify-content-end my-3">
        <CustomPagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default SlotMappingList;
