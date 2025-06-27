

import { useState, useEffect } from "react";
import Table from "../../../Components/Table";
import { GetInventoryList } from "../../../Service/ApiServices";
import { message, Tag, Modal } from "antd";
import { getUser } from "../../../Utils/Cookie";
import { useNavigate } from "react-router-dom";
import Button from "../../../Components/Button";
import { AddInventory } from "../../../Service/ApiServices";
import { toast } from "react-toastify";
import UpdateInventoryForm from "../../../Modal/UpdateInventory";

const InventoryList = () => {
  const [inventoryList, setInventoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUpdateAllowed, setIsUpdateAllowed] = useState(false);
  const [isAddAllowed, setIsAddAllowed] = useState(false);
  const [activeSlot, setActiveSlot] = useState<any>(null);
  const [totalQuantity, setTotalQuantity] = useState("");
  const [comment, setComment] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedInventoryId, setSelectedInventoryId] = useState<number | null>(null);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const navigate = useNavigate();

  const fetchInventory = () => {
    setLoading(true);
    const user = getUser();
    GetInventoryList({
      page: pagination.current,
      size: pagination.pageSize,
      token: user?.token || "",
    })
      .then((res) => {
        if (res.data.status === 1) {
          setInventoryList(res.data.data);
          setIsAddAllowed(res.data.is_add_status === 1);
          setIsUpdateAllowed(res.data.is_update_status === 1);
          setActiveSlot(res.data.active_slot_data || null);

          setPagination((prev) => ({
            ...prev,
            total: res.data.total || res.data.data.length,
          }));
        } else {
          message.error(res.data.msg || "Failed to fetch inventory.");
        }
      })
      .catch((err) => {
        console.error(err);
        message.error("Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInventory();
  }, [pagination.current, pagination.pageSize]);

  const handlePageChange = (current: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, current, pageSize }));
  };

const handleView = (record: any) => {
  navigate(`/listLog?page=${pagination.current}`, {
    state: { inventoryId: record.id },
  });
};



  const handleEdit = (record: any) => {
    setSelectedInventoryId(record.id);
    setEditModalOpen(true);
  };

  const handleAddInventory = async () => {
    const user = getUser();
    if (!totalQuantity) {
      toast.error("Total Quantity is required");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("token", user?.token || "");
      formData.append("total_quantity", totalQuantity);
      if (comment) {
        formData.append("comment", comment);
      }

      const response = await AddInventory(formData);
      if (response?.data?.status === 1) {
        toast.success("Inventory added successfully");
        setTotalQuantity("");
        setComment("");
        fetchInventory();
      } else {
        toast.error(response.data.msg || "Failed to add inventory");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const columns = [
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
      title: "Total Quantity",
      dataIndex: "total_quantity",
      key: "total_quantity",
    },
    {
      title: "Available Quantity",
      dataIndex: "available_quantity",
      key: "available_quantity",
    },
    {
      title: "Used Quantity",
      dataIndex: "used_quantity",
      key: "used_quantity",
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Status",
      dataIndex: "status_text",
      key: "status_text",
      render: (text: string) => {
        const color = text === "Active" ? "green" : text === "Closed" ? "volcano" : "default";
        return <Tag color={color}>{text || "-"}</Tag>;
      },
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
    },
  ];

  const renderAlertMessage = () => {
    if (isAddAllowed && isUpdateAllowed) {
      return (
        <div className="alert alert-success mb-3">
          You can <strong>add</strong> and <strong>update</strong> inventory now.
        </div>
      );
    } else if (isUpdateAllowed && !isAddAllowed) {
      return (
        <div className="alert alert-warning mb-3">
          You can <strong>update</strong> inventory. Adding is <strong>disabled</strong>.
        </div>
      );
    } else if (!isUpdateAllowed && isAddAllowed) {
      return (
        <div className="alert alert-warning mb-3">
          You can <strong>add</strong> inventory. Updating is <strong>disabled</strong>.
        </div>
      );
    } else {
      return (
        <div className="alert alert-danger mb-3">
          You <strong>cannot add</strong> or <strong>update</strong> inventory at this time.
        </div>
      );
    }
  };

  const renderSlotTime = () => {
    if (activeSlot?.inventory_start_time && activeSlot?.inventory_end_time) {
      return (
        <p className="text-muted mb-2">
          Inventory update window: <strong>{activeSlot.inventory_start_time}</strong> to {" "}
          <strong>{activeSlot.inventory_end_time}</strong>
        </p>
      );
    }
    return null;
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Inventory List</h2>
      </div>

      {renderAlertMessage()}
      {renderSlotTime()}

      {isAddAllowed && (
        <div className="row g-3 align-items-end mt-2 mb-4">
          <div className="col-md-3">
            <label className="form-label">
              Total Quantity <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter quantity"
              value={totalQuantity}
              onChange={(e) => setTotalQuantity(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">
              Comment <span className="text-muted">(optional)</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <div className="col-auto">
            <Button
              className="btn-primary"
              onClick={handleAddInventory}
              disabled={!totalQuantity}
            >
              Submit Inventory
            </Button>
          </div>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={inventoryList}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        isUpdateAllowed={isUpdateAllowed}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
          onChange: handlePageChange,
        }}
      />

      {selectedInventoryId && (
        <Modal
          visible={editModalOpen}
          onCancel={() => setEditModalOpen(false)}
          footer={null}
          title="Update Inventory"
        >
          <UpdateInventoryForm
            inventoryId={selectedInventoryId}
            onSuccess={() => {
              fetchInventory();
              setEditModalOpen(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default InventoryList;
