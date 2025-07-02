

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CustomTable from "../../../Components/CustomTable";
import CustomPagination from "../../../Components/CustomPagination";
import { GetSlotMapping } from "../../../Service/ApiServices";
import type { ColumnsType } from "antd/es/table";
import { useToken } from "../../../Hooks/UserHook";
import { toast } from "react-toastify";

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
  const [data, setData] = useState<SlotMappingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const token = useToken();
  const location = useLocation();
  const { slotId, givenType } = location.state || {};

  useEffect(() => {
    if (token) fetchData(token, pagination.current, pagination.pageSize);
  }, [token, pagination.current, pagination.pageSize]);

  const fetchData = (token: string, page = 1, size = 10) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("token", token);
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

      {/* <Modal
        title="Slot Details"
        open={viewModal}
        onCancel={() => setViewModal(false)}
        footer={null}
        width={600}
      > */}
        {/* {viewData.length === 0 ? (
          <p>No details found for this slot.</p>
        ) : (
          <List
            itemLayout="vertical"
            dataSource={viewData}
            renderItem={(item) => (
              <List.Item key={item.slot_log_id}>
                <List.Item.Meta
                  title={
                    <strong>
                      {item.slot_name} Slot — {item.customer_name}
                    </strong>
                  }
                  description={`Scheduled Date: ${item.scheduled_date}`}
                />
                <ul style={{ paddingLeft: 20 }}>
                  <li>
                    <strong>Milk Given Status:</strong> {item.milk_given_status}
                  </li>
                  <li>
                    <strong>Milk Given Type:</strong> {item.milk_given_type}
                  </li>
                  <li>
                    <strong>Given Quantity:</strong> {item.milk_given_quantity}{" "}
                    L
                  </li>
                  <li>
                    <strong>Actual Quantity:</strong>{" "}
                    {item.actual_milk_quantity} L
                  </li>
                  <li>
                    <strong>Unit Price:</strong> ₹{item.unit_price}
                  </li>
                  <li>
                    <strong>Assigned:</strong> {item.is_assigned}
                  </li>
                  <li>
                    <strong>Assigned Distributor:</strong>{" "}
                    {item.assigned_name || "N/A"}
                  </li>
                  <li>
                    <strong>Payment Mode:</strong>{" "}
                    {item.user_pay_mode === 1
                      ? "Cash"
                      : item.user_pay_mode === 2
                      ? "Online"
                      : "Other"}
                  </li>
                </ul>
              </List.Item>
            )}
          />
        )} */}

      {/* </Modal> */}
    </>
  );
};

export default SlotMappingList;
