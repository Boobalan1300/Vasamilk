
import { useEffect, useState } from "react";
import { Row, Col, Button, Select, DatePicker, message, Spin, Tag } from "antd";
import dayjs from "dayjs";
import { getUser } from "../../../Utils/Cookie";
import {
  GetDistributorInventoryLog,
} from "../../../Service/ApiServices";
import { CustomTable } from "../../../Components/CustomTable";
import AddDistributorLogModal from "../../../Modal/AddDistributorLog";

const { RangePicker } = DatePicker;
const { Option } = Select;

const DistributorLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [distributorId, setDistributorId] = useState<number>(0);
  const [dateRange, setDateRange] = useState<[any, any]>([
    dayjs(),
    dayjs(),
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLogs = (pageParam = 1, pageSizeParam = pagination.pageSize) => {
    const token = getUser()?.token;
    if (!token) return;

    const formData = new FormData();
    formData.append("token", token);
    // formData.append("from_date", dayjs(dateRange[0]).format("YYYY-MM-DD"));
    // formData.append("to_date", dayjs(dateRange[1]).format("YYYY-MM-DD"));
    // formData.append("distributor_id", String(distributorId));
    // formData.append("log_type", "1");

    setLoading(true);
    GetDistributorInventoryLog(formData, pageParam, pageSizeParam)
      .then((res) => {
        if (res.data.status === 1) {
          setLogs(res.data.data);
          setPagination((prev) => ({
            ...prev,
            current: pageParam,
            pageSize: pageSizeParam,
            total: res.data.total_count || 0,
          }));
        } else {
          message.error(res.data.msg || "Failed to fetch logs");
        }
      })
      .catch(() => message.error("Something went wrong"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const columns = [
    {
      title: "Slot",
      dataIndex: "slot_name",
      key: "slot_name",
      render: (text: string) => (
        <Tag color={text === "Morning" ? "gold" : "blue"}>{text}</Tag>
      ),
    },
    {
      title: "Type",
      dataIndex: "type_name",
      key: "type_name",
      render: (text: string) => {
        let color = "default";
        if (text.toLowerCase().includes("in")) color = "green";
        else if (text.toLowerCase().includes("out")) color = "red";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    {
      title: "Previous Quantity",
      dataIndex: "pervious_quantity",
      key: "pervious_quantity",
    },
    {
      title: "Remaining Quantity",
      dataIndex: "remaining_quantity",
      key: "remaining_quantity",
    },
    { title: "Given By", dataIndex: "given_by_name", key: "given_by_name" },
    { title: "Customer", dataIndex: "customer_name", key: "customer_name" },
    { title: "Created At", dataIndex: "created_at", key: "created_at" },
  ];

  return (
    <div className="p-3">
      <h2 className="mb-3">Distributor Log</h2>

      <Row justify="end" className="mb-2">
        <Col>
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            + Add Log
          </Button>
        </Col>
      </Row>

      <Row gutter={16} className="mb-3">
        <Col span={6}>
          <RangePicker
            value={dateRange}
            onChange={(dates) => {
              if (dates) setDateRange(dates as [any, any]);
            }}
          />
        </Col>
        <Col span={6}>
          <Select
            placeholder="Select Distributor"
            value={distributorId || undefined}
            onChange={(value) => setDistributorId(value)}
            style={{ width: "100%" }}
          >
            <Option value={0}>All Distributors</Option>
            <Option value={18}>Mahil</Option>
            <Option value={25}>Sarath_Distributor</Option>
            <Option value={29}>Surya</Option>
          </Select>
        </Col>
        <Col>
          <Button type="primary" onClick={() => fetchLogs(1)}>
            Filter
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Spin />
      ) : (
        <CustomTable
          data={logs}
          columns={columns}
          pagination={pagination}
          onPageChange={(page, pageSize) => fetchLogs(page, pageSize)}
          rowKey="id"
          loading={loading}
        />
      )}

      <AddDistributorLogModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchLogs()}
      />
    </div>
  );
};

export default DistributorLog;
