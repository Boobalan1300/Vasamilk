import { useEffect, useState } from "react";
import { Table, Tag, Spin, Button } from "antd";
import { GetInventoryLog } from "../../../Service/ApiServices";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { getUser } from "../../../Utils/Cookie";

const ListLog = () => {
  const [logData, setLogData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
const location = useLocation();
const inventoryId = location.state?.inventoryId;
const [searchParams] = useSearchParams();
const page = searchParams.get("page") || "1";

 const navigate = useNavigate();

useEffect(() => {
  const user = getUser();
  if (!user?.token || !inventoryId) return;

  setLoading(true);
  GetInventoryLog({
    token: user.token,
    inventory_id: Number(inventoryId),
    page: 1,
    size: 100,
  })
    .then((res) => {
      if (res.data.status === 1) {
        setLogData(res.data.data);
      }
    })
    .catch(() => {
      setLogData([]);
    })
    .finally(() => setLoading(false));
}, [inventoryId]);


  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (value: string) =>
        value === "In" ? <Tag color="green">In</Tag> : <Tag color="red">Out</Tag>,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Remaining",
      dataIndex: "remaining_quantity",
      key: "remaining_quantity",
    },
    {
      title: "Previous",
      dataIndex: "pervious_quantity",
      key: "pervious_quantity",
    },
    {
      title: "Given By",
      dataIndex: "given_by_name",
      key: "given_by_name",
    },
    {
      title: "Slot",
      dataIndex: "slot_name",
      key: "slot_name",
      render: (slot: string) => {
        const color = slot === "Morning" ? "blue" : slot === "Evening" ? "gold" : "default";
        return <Tag color={color}>{slot || "-"}</Tag>;
      },
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
    },
  ];

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Inventory Log</h2>
       <Button type="primary" onClick={() => navigate(`/inventory?page=${page}`)}>
  Back
</Button>

      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spin size="large" />
        </div>
      ) : (
        <div className="table-responsive">
          <Table columns={columns} dataSource={logData} rowKey="id" pagination={false} />
        </div>
      )}
    </div>
  );
};

export default ListLog;
