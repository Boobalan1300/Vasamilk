
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useToken } from "../../../Hooks/UserHook";
import { useLoader } from "../../../Hooks/useLoader";
import { Images } from "../../../Utils/Images";
import { GetInventoryList,AddInventory as AddInventoryApi } from "../../../Service/ApiServices";
import CustomTable from "../../../Components/CustomTable";
import CustomPagination from "../../../Components/CustomPagination";
import CustomButton from "../../../Components/Button";
import FormField from "../../../Components/InputField";
import UpdateInventoryForm from "../../../Modal/UpdateInventory";
import AddDistributorLogModal from "../../../Modal/AddDistributorLog";
import type { ColumnsType } from "antd/es/table";
import { Tag, Tooltip } from "antd";

export interface SlotInventoryItem {
  id: number;
  slot_id: number;
  slot_name: string;
  total_quantity: number;
  available_quantity: number;
  used_quantity: number;
  created_at: string;
  updated_at: string;
  status: number;
  status_text: string;
  comment: string;
}

const InventoryList = () => {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const token = useToken();
  const [inventoryList, setInventoryList] = useState<any[]>([]);
  const [isUpdateAllowed, setIsUpdateAllowed] = useState(false);
  const [isAddAllowed, setIsAddAllowed] = useState(false);
  const [activeSlot, setActiveSlot] = useState<any>(null);
  const [totalQuantity, setTotalQuantity] = useState("");
  const [comment, setComment] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedInventoryId, setSelectedInventoryId] = useState<number | null>(null);
  const [addLogModalOpen, setAddLogModalOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<SlotInventoryItem | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

 
  useEffect(() => {
    fetchInventory();
  }, [pagination.current, pagination.pageSize]);

const fetchInventory = () => {
  if (!token) return;
  showLoader();

  const formData = new FormData();
  formData.append("token", token);

  GetInventoryList(formData, pagination.current, pagination.pageSize)
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
        toast.error(res.data.msg || "Failed to fetch inventory.");
      }
    })
    .catch(() => {
      toast.error("Something went wrong");
    })
    .finally(() => {
      hideLoader();
    });
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

  const handleAddLog = (record: SlotInventoryItem) => {
    setSelectedInventory(record);
    setAddLogModalOpen(true);
  };

  const handleAddInventory = () => {
    if (!totalQuantity) {
      toast.error("Total Quantity is required");
      return;
    }

    showLoader();
    const formData = new FormData();
    formData.append("token", token || "");
    formData.append("total_quantity", totalQuantity);
    if (comment) {
      formData.append("comment", comment);
    }

    AddInventoryApi(formData)
      .then((response) => {
        if (response?.data?.status === 1) {
          toast.success("Inventory added successfully");
          setTotalQuantity("");
          setComment("");
          fetchInventory();
        } else {
          toast.error(response.data.msg || "Failed to add inventory");
        }
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        hideLoader();
      });
  };

  const columns: ColumnsType<SlotInventoryItem> = [
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
    { title: "Comment", dataIndex: "comment", key: "comment" },
    {
      title: "Status",
      dataIndex: "status_text",
      key: "status_text",
      render: (text: string) => {
        const color =
          text === "Active"
            ? "green"
            : text === "Closed"
            ? "volcano"
            : "default";
        return <Tag color={color}>{text || "-"}</Tag>;
      },
    },
    { title: "Created At", dataIndex: "created_at", key: "created_at" },
    {
      title: "Actions",
      key: "actions",
      render: (_text, record) => {
        const canEdit = isUpdateAllowed && record.status_text === "Active";
        const canAdd = record.status_text === "Active";

        return (
          <div className="d-flex gap-2">
            <Tooltip title="View">
              <CustomButton
                className="btn-link p-0 border-0 bg-transparent"
                onClick={() => handleView(record)}
              >
                <img
                  src={Images.eye}
                  alt="view"
                  style={{ width: 20, height: 20 }}
                />
              </CustomButton>
            </Tooltip>

            {canEdit && (
              <Tooltip title="Edit">
                <CustomButton
                  className="btn-link p-0 border-0 bg-transparent"
                  onClick={() => handleEdit(record)}
                >
                  <img
                    src={Images.edit}
                    alt="edit"
                    style={{ width: 20, height: 20 }}
                  />
                </CustomButton>
              </Tooltip>
            )}

            {canAdd && (
              <Tooltip title="Add Distributor Log">
                <CustomButton
                  className="btn-link p-0 border-0 bg-transparent"
                  onClick={() => handleAddLog(record)}
                >
                  <img
                    src={Images.add}
                    alt="add"
                    style={{ width: 20, height: 20 }}
                  />
                </CustomButton>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  const renderAlertMessage = () => {
    if (isAddAllowed && isUpdateAllowed) {
      return (
        <div className="alert alert-success mb-3">
          You can <strong>add</strong> and <strong>update</strong> inventory
          now.
        </div>
      );
    } else if (isUpdateAllowed && !isAddAllowed) {
      return (
        <div className="alert alert-warning mb-3">
          You can <strong>update</strong> inventory. Adding is{" "}
          <strong>disabled</strong>.
        </div>
      );
    } else if (!isUpdateAllowed && isAddAllowed) {
      return (
        <div className="alert alert-warning mb-3">
          You can <strong>add</strong> inventory. Updating is{" "}
          <strong>disabled</strong>.
        </div>
      );
    } else {
      return (
        <div className="alert alert-danger mb-3">
          You <strong>cannot add</strong> or <strong>update</strong> inventory
          at this time.
        </div>
      );
    }
  };

  const renderSlotTime = () => {
    if (activeSlot?.inventory_start_time && activeSlot?.inventory_end_time) {
      return (
        <p className="text-muted mb-2">
          Inventory update window:{" "}
          <strong>{activeSlot.inventory_start_time}</strong> to{" "}
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
        <div className="row g-3  align-items-center mt-2 mb-4">
          <div className="col-md-3">
            <FormField
              label="Total Quantity"
              type="number"
              name="total_quantity"
              value={totalQuantity}
              placeholder="Enter quantity"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTotalQuantity(e.target.value)
              }
              onBlur={() => {}}
              error={!totalQuantity ? "Total quantity is required" : ""}
              touched={false}
            />
          </div>
          <div className="col-md-4">
            <FormField
              label="Comment (optional)"
              type="text"
              name="comment"
              value={comment}
              placeholder="Enter comment (optional)"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setComment(e.target.value)
              }
              onBlur={() => {}}
            />
          </div>
          <div className="col-auto">
            <CustomButton
              className="btn-submit px-3 py-2"
              onClick={handleAddInventory}
              disabled={!totalQuantity}
            >
              Submit Inventory
            </CustomButton>
          </div>
        </div>
      )}

      <CustomTable columns={columns} data={inventoryList} />

      <div className="d-flex justify-content-end my-3">
        <CustomPagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={(page, pageSize) =>
            setPagination((prev) => ({ ...prev, current: page, pageSize }))
          }
        />
      </div>

      {selectedInventoryId && (
        <UpdateInventoryForm
          visible={editModalOpen}
          inventoryId={selectedInventoryId}
          onClose={() => setEditModalOpen(false)}
          onSuccess={fetchInventory}
        />
      )}

      {selectedInventory && (
        <AddDistributorLogModal
          visible={addLogModalOpen}
          onClose={() => setAddLogModalOpen(false)}
          onSuccess={() => {
            fetchInventory();
            setAddLogModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default InventoryList;
