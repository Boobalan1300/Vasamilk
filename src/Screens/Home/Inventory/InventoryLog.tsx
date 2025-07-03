import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { GetInventoryLog } from "../../../Service/ApiServices";
import CustomTable from "../../../Components/CustomTable";
import { useLoader } from "../../../Hooks/useLoader";
import { useToken } from "../../../Hooks/UserHook";
import CustomButton from "../../../Components/Button";
import { Tag } from "antd";

const ListLog = () => {
  
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const token = useToken();

  const [logData, setLogData] = useState<any[]>([]);
  const location = useLocation();
  const inventoryId = location.state?.inventoryId;
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";


  useEffect(() => {
    if (token && inventoryId) {
      fetchInventoryLog(token);
    }
  }, [token, inventoryId]);

  const fetchInventoryLog = (token: string) => {
    showLoader();
    GetInventoryLog({
      token,
      inventory_id: Number(inventoryId),
      page: 1,
      size: 100,
    })
      .then((res) => {
        if (res.data.status === 1) {
          setLogData(res.data.data);
        } else {
          setLogData([]);
        }
      })
      .catch(() => {
        setLogData([]);
      })
      .finally(() => hideLoader());
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (value: string) =>
        value === "In" ? (
          <Tag color="green">In</Tag>
        ) : (
          <Tag color="red">Out</Tag>
        ),
    },
    {
      title: "Previous",
      dataIndex: "pervious_quantity",
      key: "pervious_quantity",
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
      title: "Given By",
      dataIndex: "given_by_name",
      key: "given_by_name",
    },
    {
      title: "Slot",
      dataIndex: "slot_name",
      key: "slot_name",
      render: (slot: string) => {
        const color =
          slot === "Morning" ? "blue" : slot === "Evening" ? "gold" : "default";
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
        <CustomButton
          className="btn-grey px-2 py-1"
          onClick={() => navigate(`/inventory?page=${page}`)}
        >
          Back
        </CustomButton>
      </div>

      <div className="table-responsive">
        <CustomTable columns={columns} data={logData} rowKey="id" />
      </div>
    </div>
  );
};

export default ListLog;
