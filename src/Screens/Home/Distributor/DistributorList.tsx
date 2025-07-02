
import { useEffect, useState } from "react";
import { Tag } from "antd";
import { GetDistributorLines } from "../../../Service/ApiServices";
import { useNavigate } from "react-router-dom";
import CustomTable from "../../../Components/CustomTable";
import type { ColumnsType } from "antd/es/table";
import { useLoader } from "../../../Hooks/useLoader";
import { toast } from "react-toastify";
import { useToken } from "../../../Hooks/UserHook";
import CustomButton from "../../../Components/Button";

interface LineData {
  id: number;
  line_name: string;
  status: number;
}

interface Distributor {
  distributer_id: number;
  distributer_name: string;
  line_data: LineData[];
}

interface TableRow {
  key: string;
  distributor_name: string;
  distributorId?: number;
  lineCount?: number;
  action?: React.ReactNode;
  isLine?: boolean;
  children?: TableRow[];
}

const DistributorLinesTable = () => {
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const token = useToken();

  useEffect(() => {
    fetchDistributors();
  }, []);

  const fetchDistributors = () => {
    if (!token) return;

    const formData = new FormData();
    formData.append("token", token);

    showLoader();
    GetDistributorLines(formData)
      .then((res) => {
        if (res.data.status === 1) {
          const transformedData: TableRow[] = res.data.data.map(
            (dist: Distributor) => ({
              key: `d-${dist.distributer_id}`,
              distributor_name: dist.distributer_name,
              distributorId: dist.distributer_id,
              lineCount: dist.line_data.length,
              children: dist.line_data.map((line) => ({
                key: `l-${line.id}`,
                distributor_name: line.line_name,
                isLine: true,
                action: (
                  <CustomButton
                    className="btn text-success p-0 border-0"
                    onClick={() =>
                      navigate("/assignedSlots", {
                        state: {
                          lineId: line.id,
                          distributorId: dist.distributer_id,
                        },
                      })
                    }
                  >
                    View Slots
                  </CustomButton>
                ),
              })),
            })
          );

          setTableData(transformedData);
        } else {
          toast.error(res.data.msg || "Failed to fetch distributors");
        }
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => hideLoader());
  };

  const handleToggleExpand = (key: string) => {
    setExpandedKeys((prev) => (prev.includes(key) ? [] : [key]));
  };

  const columns: ColumnsType<TableRow> = [
    {
      title: "Distributor / Route Name",
      key: "distributor_name",
      width: "50%",
      render: (_, record) => {
        if (record.isLine) {
          return <Tag color="blue">{record.distributor_name}</Tag>;
        }
        return record.distributor_name;
      },
    },
    {
      title: "Action",
      key: "action",
      width: "50%",
      render: (_, record) => {
        if (
          record.lineCount !== undefined &&
          record.distributorId !== undefined
        ) {
          return record.lineCount > 0 ? (
            <CustomButton
              className="bg-transparent p-0 border-0 text-primary"
              onClick={() => handleToggleExpand(record.key)}
            >
              {expandedKeys.includes(record.key) ? "Hide Lines" : "View Lines"}
            </CustomButton>
          ) : (
            <span style={{ color: "#999" }}>No Lines</span>
          );
        }
        return record.action || null;
      },
    },
  ];

  return (
    <div className="container my-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Distributor Lines & Assigned Slots</h2>
        <CustomButton
          className="btn-grey px-3 py-1"
          onClick={() => navigate("/assignDistributor")}
        >
          Assign Distributor
        </CustomButton>
      </div>

      <CustomTable
        data={tableData}
        columns={columns}
        rowKey="key"
        expandable={{
          expandedRowKeys: expandedKeys,
          onExpandedRowsChange: (keys) => setExpandedKeys(keys as string[]),
          expandIcon: () => null,
          indentSize: 0,
        }}
      />
    </div>
  );
};

export default DistributorLinesTable;
