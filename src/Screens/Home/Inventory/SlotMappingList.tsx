

import { useEffect, useState } from "react";
import { Modal, message } from "antd";
import Table from "../../../Components/Table";
import { customPagination } from "../../../Components/CustomPagination";
import {
  GetSlotMapping,
  AddDistributorInventoryLog,
  GetDistributorInventoryLog,
} from "../../../Service/ApiServices";
import { getUser } from "../../../Utils/Cookie";
import { slotMappingColumns } from "../../../Utils/Constants/slotMappingColumns";

const SlotMappingList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewData, setViewData] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const user = getUser();
  const token = user?.token || "";
  const date = "2025-06-24";

  const fetchData = async (page = 1, size = 10) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("token", token);
    try {
      const res = await GetSlotMapping(formData, page, size);
      const { data: resultData, total } = res.data;
      setData(resultData || []);
      setPagination({ current: page, pageSize: size, total: total || 0 });
    } catch {
      message.error("Failed to fetch slot mappings");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLog = async () => {
    const formData = new FormData();
    formData.append("token", token);
    // formData.append("distributer_id", record.distributor_id);
    // formData.append("given_qty", "15");
    // formData.append("type", "1");

    try {
      const res = await AddDistributorInventoryLog(formData);
      if (res.data.status === 1) {
        message.success("Log added successfully");
        fetchData(pagination.current, pagination.pageSize);
      } else {
        message.error(res.data.msg || "Failed to add log");
      }
    } catch {
      message.error("Something went wrong while adding the log");
    }
  };

  const handleViewLog = async (record: any) => {
    const formData = new FormData();
    formData.append("token", token);
    formData.append("distributor_id", record.distributor_id);
    formData.append("from_date", date);
    formData.append("to_date", date);
    formData.append("log_type", "0");

    try {
      const res = await GetDistributorInventoryLog(formData);
      setViewData(res.data.data || []);
      setViewModal(true);
    } catch {
      message.error("Failed to fetch logs");
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handlePageChange = (page: number, pageSize: number) => {
    fetchData(page, pageSize);
  };

  return (
    <>
      <Table
        columns={slotMappingColumns}
        dataSource={data}
        loading={loading}
        rowKey="slot_log_id"
        onEdit={handleAddLog}
        onView={handleViewLog}
        isUpdateAllowed={true}
        pagination={customPagination({
          pagination,
          onChange: handlePageChange,
        })}
      />

      <Modal
        title="Distributor Logs"
        open={viewModal}
        onCancel={() => setViewModal(false)}
        footer={null}
      >
        <ul>
          {viewData.map((log: any) => (
            <li key={log.id}>
              <strong>{log.type_name}</strong>: {log.quantity} @ {log.created_at}
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
};

export default SlotMappingList;
