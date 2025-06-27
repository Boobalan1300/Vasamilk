
import { useEffect, useState } from "react";
import { Modal, Table, Tag, Spin } from "antd";
import { GetInventoryLog } from "../Service/ApiServices";

interface InventoryLogProps {
  visible: boolean;
  onClose: () => void;
  inventoryId: number;
  token: string;
}

const InventoryLog = ({
  visible,
  onClose,
  inventoryId,
  token,
}: InventoryLogProps) => {
  const [logData, setLogData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      GetInventoryLog({ token, inventory_id: inventoryId, page: 1, size: 10 })
        .then((res) => {
          if (res.data.status === 1) {
            setLogData(res.data.data);
          }
        })
        .catch(() => {
          setLogData([]);
        })
        .finally(() => setLoading(false));
    }
  }, [visible, inventoryId]);

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
        let color =
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
    <Modal
      title="Inventory Log"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      {loading ? (
        <div className="text-center py-5">
          <Spin />
        </div>
      ) : (
        <div className="table-responsive">
            <Table
          columns={columns}
          dataSource={logData}
          rowKey="id"
          pagination={false}
        />
        </div>
      )}
    </Modal>
  );
};

export default InventoryLog;


