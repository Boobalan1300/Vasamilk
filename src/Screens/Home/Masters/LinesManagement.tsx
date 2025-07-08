import React, { useEffect, useState } from "react";
import { Card, Popconfirm, Tooltip } from "antd";
import { StopOutlined, CheckCircleOutlined } from "@ant-design/icons";
import {
  GetLinesList,
  DeleteLine,
  ToggleLineStatus, 
} from "../../../Service/ApiServices";
import { useToken } from "../../../Hooks/UserHook";
import { useLoader } from "../../../Hooks/useLoader";
import CustomTable from "../../../Components/CustomTable";
import CustomPagination from "../../../Components/CustomPagination";
import CustomButton from "../../../Components/Button";
import { Images } from "../../../Utils/Images";
import { toast } from "react-toastify";
import LinesModal from "../../../Modal/LinesModal";

export type Line = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  status: number;         
  status_text: string;
};

const LinesManagement: React.FC = () => {
  const token = useToken();
  const { showLoader, hideLoader } = useLoader();

  const [lines, setLines] = useState<Line[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  const [lineModalVisible, setLineModalVisible] = useState(false);
  const [selectedLine, setSelectedLine] = useState<Line | undefined>(undefined);

  const fetchLines = (p: number, s: number) => {
    if (!token) {
      toast.error("No token found!");
      return;
    }

    const formData = new FormData();
    formData.append("token", token);

    showLoader();

    GetLinesList(formData, p, s)
      .then((res) => {
        if (res.data.status === 1) {
          setLines(res.data.data || []);
          setPagination((prev) => ({ ...prev, total: res.data.total || 0 }));
        } else {
          toast.info(res.data.msg || "Failed to fetch lines");
        }
      })
      .catch((error) => {
        console.error("GetLinesList error:", error);
        toast.error("Something went wrong while fetching lines");
      })
      .finally(() => {
        hideLoader();
      });
  };

  useEffect(() => {
    fetchLines(pagination.page, pagination.pageSize);
  }, [pagination.page, pagination.pageSize]);

  const openAddModal = () => {
    setSelectedLine(undefined);
    setLineModalVisible(true);
  };

  const openEditModal = (line: Line) => {
    setSelectedLine(line);
    setLineModalVisible(true);
  };

  const handleDelete = (id: number) => {
    if (!token) {
      toast.error("No token found!");
      return;
    }

    const formData = new FormData();
    formData.append("token", token);
    formData.append("id", String(id));

    showLoader();
    DeleteLine(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg || "Line deleted successfully");
          fetchLines(pagination.page, pagination.pageSize);
        } else {
          toast.info(res.data.msg || "Failed to delete line");
        }
      })
      .catch((error) => {
        console.error("DeleteLine error:", error);
        toast.error("Something went wrong while deleting line");
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
    ToggleLineStatus(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg || "Line status updated successfully");
          fetchLines(pagination.page, pagination.pageSize);
        } else {
          toast.info(res.data.msg || "Failed to update line status");
        }
      })
      .catch((error) => {
        console.error("InactiveLine error:", error);
        toast.error("Something went wrong while updating line status");
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
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Created At", dataIndex: "created_at", key: "created_at" },
    { title: "Updated At", dataIndex: "updated_at", key: "updated_at" },
    { title: "Status", dataIndex: "status_text", key: "status_text" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Line) => (
        <div className="d-flex align-items-center gap-2">
          <Tooltip title="Edit">
            <CustomButton
              className="p-0 border-0 bg-transparent"
              onClick={() => openEditModal(record)}
            >
              <img src={Images.edit} alt="edit" style={{ width: 20 }} />
            </CustomButton>
          </Tooltip>

          <Popconfirm
            title={
              record.status === 1
                ? "Are you sure you want to block this line?"
                : "Are you sure you want to activate this line?"
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
                  <StopOutlined style={{ fontSize: 15 }} />
                ) : (
                  <CheckCircleOutlined style={{ fontSize: 15 }} />
                )}
              </CustomButton>
            </Tooltip>
          </Popconfirm>

          <Popconfirm
            title="Delete this line?"
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
        <h4 className="mb-0">Lines Management</h4>
        <CustomButton className="btn btn-primary btn-sm" onClick={openAddModal}>
          Add Line
        </CustomButton>
      </div>

      <Card title="Lines List" className="shadow-sm mb-4">
        <CustomTable data={lines} columns={columns} rowKey="id" />

        <div className="d-flex justify-content-end mt-3">
          <CustomPagination
            current={pagination.page}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
          />
        </div>
      </Card>

      <LinesModal
        visible={lineModalVisible}
        onClose={() => setLineModalVisible(false)}
        onSuccess={() => fetchLines(pagination.page, pagination.pageSize)}
        lineData={selectedLine}
      />
    </div>
  );
};

export default LinesManagement;
