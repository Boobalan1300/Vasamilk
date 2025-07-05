import React, { useEffect, useState } from "react";
import { Card, Popconfirm, Tooltip } from "antd";
import { StopOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { GetPriceTagsList, DeletePriceTag, TogglePriceTagStatus } from "../../../Service/ApiServices";
import { useToken } from "../../../Hooks/UserHook";
import { useLoader } from "../../../Hooks/useLoader";
import CustomTable from "../../../Components/CustomTable";
import CustomPagination from "../../../Components/CustomPagination";
import CustomButton from "../../../Components/Button";
import { Images } from "../../../Utils/Images";
import { toast } from "react-toastify";
import PriceTagModal from "../../../Modal/PriceTagModal";


type PriceTag = {
  id: number;
  name: string;
  price: string;
  created_at: string;
  updated_at: string;
  status: number;        
  status_text: string;
};

const PriceManagement: React.FC = () => {
  const token = useToken();
  const { showLoader, hideLoader } = useLoader();
  const [priceTags, setPriceTags] = useState<PriceTag[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPriceTag, setSelectedPriceTag] = useState<PriceTag | undefined>(undefined);

  const fetchPriceTags = (p: number, s: number) => {
    if (!token) {
      toast.error("No token found!");
      return;
    }
    const formData = new FormData();
    formData.append("token", token);
    showLoader();
    GetPriceTagsList(formData, p, s)
      .then((res) => {
        if (res.data.status === 1) {
          setPriceTags(res.data.data || []);
          setPagination((prev) => ({ ...prev, total: res.data.total || 0 }));
        } else {
          toast.info(res.data.msg || "Failed to fetch price tags");
        }
      })
      .catch((err) => {
        console.error("GetPriceTagsList error:", err);
        toast.error("Something went wrong while fetching price tags");
      })
      .finally(() => hideLoader());
  };

  useEffect(() => {
    fetchPriceTags(pagination.page, pagination.pageSize);
  }, [pagination.page, pagination.pageSize]);

  const handleDelete = (id: number) => {
    if (!token) {
      toast.error("No token found!");
      return;
    }
    const formData = new FormData();
    formData.append("token", token);
    formData.append("id", String(id));
    showLoader();
    DeletePriceTag(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg || "Price tag deleted successfully");
          fetchPriceTags(pagination.page, pagination.pageSize);
        } else {
          toast.info(res.data.msg || "Failed to delete price tag");
        }
      })
      .catch((err) => {
        console.error("DeletePriceTag error:", err);
        toast.error("Something went wrong while deleting price tag");
      })
      .finally(() => hideLoader());
  };

  const handleToggleStatus = (id: number, currentStatus: number) => {
    if (!token) {
      toast.error("No token found!");
      return;
    }
    const formData = new FormData();
    formData.append("token", token);
    formData.append("id", String(id));
    formData.append("status", currentStatus === 1 ? "2" : "1"); // toggle
    showLoader();
    TogglePriceTagStatus(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg || "Price tag status updated");
          fetchPriceTags(pagination.page, pagination.pageSize);
        } else {
          toast.info(res.data.msg || "Failed to update price tag status");
        }
      })
      .catch((err) => {
        console.error("TogglePriceTagStatus error:", err);
        toast.error("Something went wrong while updating price tag status");
      })
      .finally(() => hideLoader());
  };

  const handlePageChange = (page: number, size?: number) => {
    setPagination((prev) => ({ page, pageSize: size ?? prev.pageSize, total: prev.total }));
  };

  const handleSuccess = () => {
    fetchPriceTags(pagination.page, pagination.pageSize);
  };

  const columns = [
    // { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Created At", dataIndex: "created_at", key: "created_at" },
    { title: "Updated At", dataIndex: "updated_at", key: "updated_at" },
    { title: "Status", dataIndex: "status_text", key: "status_text" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: PriceTag) => (
        <div className="d-flex align-items-center gap-2">
          <Tooltip title="Edit">
            <CustomButton
              className="p-0 border-0 bg-transparent"
              onClick={() => {
                setSelectedPriceTag(record);
                setModalVisible(true);
              }}
            >
              <img src={Images.edit} alt="edit" style={{ width: 20 }} />
            </CustomButton>
          </Tooltip>

          <Popconfirm
            title={
              record.status === 1
                ? "Are you sure you want to deactivate this price tag?"
                : "Are you sure you want to activate this price tag?"
            }
            onConfirm={() => handleToggleStatus(record.id, record.status)}
          >
            <Tooltip title={record.status === 1 ? "Deactivate" : "Activate"}>
              <CustomButton
                className={`p-0 border-0 bg-transparent ${
                  record.status === 1 ? "text-warning" : "text-success"
                }`}
              >
                {record.status === 1 ? (
                  <StopOutlined style={{ fontSize: 15 }} />
                ) : (
                  <CheckCircleOutlined style={{ fontSize: 15 }} />
                )}
              </CustomButton>
            </Tooltip>
          </Popconfirm>

          <Popconfirm
            title="Delete this price tag?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip title="Delete">
              <CustomButton className="p-0 border-0 bg-transparent text-danger">
                <img src={Images.trash} alt="delete" style={{ width: 20 }} />
              </CustomButton>
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Price Tags Management</h4>
        <CustomButton
          className="btn btn-primary btn-sm"
          onClick={() => {
            setSelectedPriceTag(undefined);
            setModalVisible(true);
          }}
        >
          Add Price Tag
        </CustomButton>
      </div>

      <Card title="Price Tags List" className="shadow-sm mb-4">
        <CustomTable data={priceTags} columns={columns} rowKey="id" />

        <div className="d-flex justify-content-end mt-3">
          <CustomPagination
            current={pagination.page}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
          />
        </div>
      </Card>

      <PriceTagModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={handleSuccess}
        priceTagData={selectedPriceTag}
      />
    </div>
  );
};

export default PriceManagement;
