import React, { useEffect, useState } from "react";
import { Card, Popconfirm, Tooltip } from "antd";
import { CheckCircleOutlined, StopOutlined } from "@ant-design/icons";
import {
  GetReasonList,
  DeleteReason,
  ToggleReasonStatus,
} from "../../../Service/ApiServices";
import { useToken } from "../../../Hooks/UserHook";
import { useLoader } from "../../../Hooks/useLoader";
import CustomTable from "../../../Components/CustomTable";
import CustomPagination from "../../../Components/CustomPagination";
import CustomButton from "../../../Components/Button";
import { Images } from "../../../Utils/Images";
import { toast } from "react-toastify";
import ReasonModal from "../../../Modal/ReasonModal";

export type Reason = {
  id: number;
  name: string;
  type: number;
  created_at: string;
  updated_at: string;
  status: number;
  status_text: string;
};

const ReasonManagement: React.FC = () => {
  const token = useToken();
  const { showLoader, hideLoader } = useLoader();

  const [reasons, setReasons] = useState<Reason[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [reasonModalVisible, setReasonModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState<Reason | undefined>(
    undefined
  );

  const fetchReasons = (p: number, s: number) => {
    if (!token) {
      toast.error("No token found!");
      return;
    }
    const formData = new FormData();
    formData.append("token", token);
    showLoader();
    GetReasonList(formData, p, s)
      .then((res) => {
        if (res.data.status === 1) {
          setReasons(res.data.data || []);
          setPagination((prev) => ({ ...prev, total: res.data.total || 0 }));
        } else {
          toast.info(res.data.msg || "Failed to fetch reasons");
        }
      })
      .catch((err) => {
        console.error("GetReasonList error:", err);
        toast.error("Something went wrong while fetching reasons");
      })
      .finally(() => hideLoader());
  };

  useEffect(() => {
    fetchReasons(pagination.page, pagination.pageSize);
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
    DeleteReason(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg || "Reason deleted successfully");
          fetchReasons(pagination.page, pagination.pageSize);
        } else {
          toast.info(res.data.msg || "Failed to delete reason");
        }
      })
      .catch((err) => {
        console.error("DeleteReason error:", err);
        toast.error("Something went wrong while deleting reason");
      })
      .finally(() => hideLoader());
  };

  const handleToggleStatus = (id: number, currentStatus: number) => {
    if (!token) {
      toast.error("No token found!");
      return;
    }
    const newStatus = currentStatus === 1 ? 2 : 1;
    const formData = new FormData();
    formData.append("token", token);
    formData.append("id", String(id));
    formData.append("status", String(newStatus));
    showLoader();
    ToggleReasonStatus(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg || "Status updated successfully");
          fetchReasons(pagination.page, pagination.pageSize);
        } else {
          toast.info(res.data.msg || "Failed to update status");
        }
      })
      .catch((err) => {
        console.error("ToggleReasonStatus error:", err);
        toast.error("Something went wrong while updating status");
      })
      .finally(() => hideLoader());
  };

  const handlePageChange = (page: number, size?: number) => {
    setPagination((prev) => ({
      page,
      pageSize: size ?? prev.pageSize,
      total: prev.total,
    }));
  };

  const columns = [
    // { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: number) =>
        ["Vendor/Logger", "Distributor", "Customer"][type - 1],
    },
    { title: "Created At", dataIndex: "created_at", key: "created_at" },
    { title: "Updated At", dataIndex: "updated_at", key: "updated_at" },
    { title: "Status", dataIndex: "status_text", key: "status_text" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Reason) => (
        <div className="d-flex align-items-center gap-2">
          <Tooltip title="Edit">
            <CustomButton
              className="p-0 border-0 bg-transparent"
              onClick={() => {
                setSelectedReason(record);
                setReasonModalVisible(true);
              }}
            >
              <img src={Images.edit} alt="edit" style={{ width: 20 }} />
            </CustomButton>
          </Tooltip>

          <Popconfirm
            title={
              record.status === 1
                ? "Are you sure you want to block this reason?"
                : "Are you sure you want to activate this reason?"
            }
            onConfirm={() => handleToggleStatus(record.id, record.status)}
          >
            <Tooltip title={record.status === 1 ? "Block" : "Activate"}>
              <CustomButton
                className={`p-0 border-0 bg-transparent ${
                  record.status === 1 ? "text-warning" : "text-success"
                }`}
              >
                {record.status === 1 ? (
                  <StopOutlined style={{ fontSize: 13 }} />
                ) : (
                  <CheckCircleOutlined style={{ fontSize: 13 }} />
                )}
              </CustomButton>
            </Tooltip>
          </Popconfirm>

          <Popconfirm
            title="Delete this reason?"
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
        <h4 className="mb-0">Reason Management</h4>
        <CustomButton
          className="btn btn-primary btn-sm"
          onClick={() => {
            setSelectedReason(undefined);
            setReasonModalVisible(true);
          }}
        >
          Add Reason
        </CustomButton>
      </div>
      <Card title="Reason List" className="shadow-sm mb-4">
        <CustomTable data={reasons} columns={columns} rowKey="id" />
        <div className="d-flex justify-content-end mt-3">
          <CustomPagination
            current={pagination.page}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
          />
        </div>
      </Card>
      <ReasonModal
        visible={reasonModalVisible}
        onClose={() => setReasonModalVisible(false)}
        onSuccess={() => fetchReasons(pagination.page, pagination.pageSize)}
        reasonData={selectedReason}
      />
    </div>
  );
};

export default ReasonManagement;
