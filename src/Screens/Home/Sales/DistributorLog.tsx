import React, { useEffect, useState } from "react";
import { Card, Spin } from "antd";
import { GetDistributorInventoryLog } from "../../../Service/ApiServices";
import CustomTable from "../../../Components/CustomTable";
import CustomPagination from "../../../Components/CustomPagination";
import { useToken } from "../../../Hooks/UserHook";

interface Props {
  fromDate: string;
  toDate: string;
  logType: number; // 1 = distributor, 2 = vendor
}

const DistributorLog: React.FC<Props> = ({ fromDate, toDate, logType }) => {
  const token = useToken();

  const [loading, setLoading] = useState(false);
  const [logData, setLogData] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchLogs = () => {
    if (!token) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("token", token);
    formData.append("distributor_id", "0");
    formData.append("from_date", fromDate);
    formData.append("to_date", toDate);
    formData.append("log_type", String(logType));

    GetDistributorInventoryLog(
      pagination.current,
      pagination.pageSize,
      formData
    )
      .then((res) => {
        if (res.data.status === 1) {
          setLogData(res.data.data);
          setPagination((prev) => ({
            ...prev,
            total: res.data.total_count,
          }));
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, [logType, fromDate, toDate, pagination.current, pagination.pageSize]);

  const columns = [
    // { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "S.No",
      key: "serial",
      render: (_: any, __: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },

    { title: "Given By", dataIndex: "given_by_name", key: "given_by_name" },
    { title: "Customer", dataIndex: "customer_name", key: "customer_name" },
    { title: "Slot", dataIndex: "slot_name", key: "slot_name" },
    { title: "Type", dataIndex: "type_name", key: "type_name" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    {
      title: "Remaining Qty",
      dataIndex: "remaining_quantity",
      key: "remaining_quantity",
    },
    { title: "Created At", dataIndex: "created_at", key: "created_at" },
  ];

  return (
    <Card title="Distributor/Vendor Logs" className="mt-4 shadow-sm">
      <Spin spinning={loading}>
        <CustomTable columns={columns} data={logData} />
        <div className="d-flex justify-content-end mt-3">
          <CustomPagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={(page, pageSize) =>
              setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize,
              }))
            }
          />
        </div>
      </Spin>
    </Card>
  );
};

export default DistributorLog;
