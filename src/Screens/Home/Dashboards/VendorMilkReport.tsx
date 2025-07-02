
// import { useState, useEffect } from "react";
// import {
//   Descriptions,
//   message,
//   Spin,
//   InputNumber,
//   DatePicker,
//   Select,
//   Button,
//   Space,
// } from "antd";
// import dayjs, { Dayjs } from "dayjs";
// import { getUser } from "../../../Utils/Cookie";
// import { GetVendorMilkReport } from "../../../Service/ApiServices";

// const { RangePicker } = DatePicker;

// interface VendorReport {
//   remaining_qty: number;
//   vendor_sales_qty: number;
//   distributor_taken_qty: number;
//   distributor_return_qty: number;
//   distributor_sales_qty: number;
// }

// const VendorMilkReport = () => {
//   const [report, setReport] = useState<VendorReport | null>(null);
//   const [loading, setLoading] = useState(false);


//   const [distributorId, setDistributorId] = useState<number>(
//     getUser()?.distributor_id ?? 0
//   );
//   const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
//     dayjs(),
//     dayjs(),
//   ]);
//   const [logType, setLogType] = useState<number>(0);

 
//   useEffect(() => {
//     fetchVendorReport();
    
//   }, []);

//   const fetchVendorReport = () => {
//     const token = getUser()?.token;
//     if (!token) {
//       message.error("Authentication token missing");
//       return;
//     }

//     setLoading(true);
//     const formData = new FormData();
//     formData.append("token", token);
//     formData.append("distributor_id", String(distributorId));
//     formData.append("from_date", dateRange[0].format("YYYY-MM-DD"));
//     formData.append("to_date", dateRange[1].format("YYYY-MM-DD"));
//     formData.append("log_type", String(logType));

//     GetVendorMilkReport(formData)
//       .then((res) => {
//         if (res.data.status === 1) {
//           setReport(res.data.data);
//         } else {
//           message.error(res.data.msg || "Failed to load vendor report");
//           setReport(null);
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching vendor milk report:", err);
//         message.error("Something went wrong while fetching the vendor report");
//         setReport(null);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   return (
//     <div className="p-3">
//       <h2>Vendor Milk Report</h2>

  
//       <Space wrap style={{ marginBottom: 16 }}>
//         <span>
//           Distributor ID:{" "}
//           <InputNumber
//             min={0}
//             value={distributorId}
//             onChange={(v) => setDistributorId(v ?? 0)}
//           />
//         </span>

//         <span>
//           Date Range:{" "}
//           <RangePicker
//             value={dateRange}
//             onChange={(vals) =>
//               setDateRange(
//                 vals && vals[0] && vals[1]
//                   ? [vals[0], vals[1]]
//                   : [dayjs(), dayjs()]
//               )
//             }
//             format="YYYY-MM-DD"
//           />
//         </span>

//         <span>
//           Log Type:{" "}
//           <Select<number>
//             value={logType}
//             onChange={(v) => setLogType(v)}
//             style={{ width: 120 }}
//           >
//             <Select.Option value={0}>All</Select.Option>
//             <Select.Option value={1}>In</Select.Option>
//             <Select.Option value={2}>Out</Select.Option>
//           </Select>
//         </span>

//         <Button type="primary" onClick={fetchVendorReport}>
//           Fetch Report
//         </Button>
//       </Space>

//       {/* Report */}
//       {loading ? (
//         <Spin />
//       ) : report ? (
//         <Descriptions bordered column={1} size="middle">
//           <Descriptions.Item label="Remaining Quantity (L)">
//             {report.remaining_qty}
//           </Descriptions.Item>
//           <Descriptions.Item label="Vendor Sales (L)">
//             {report.vendor_sales_qty}
//           </Descriptions.Item>
//           <Descriptions.Item label="Distributor Taken (L)">
//             {report.distributor_taken_qty}
//           </Descriptions.Item>
//           <Descriptions.Item label="Distributor Return (L)">
//             {report.distributor_return_qty}
//           </Descriptions.Item>
//           <Descriptions.Item label="Distributor Sales (L)">
//             {report.distributor_sales_qty}
//           </Descriptions.Item>
//         </Descriptions>
//       ) : (
//         <p>No data to display</p>
//       )}
//     </div>
//   );
// };

// export default VendorMilkReport;







import { useState, useEffect } from "react";
import {
  Descriptions,
  message,
  Spin,
  InputNumber,
  DatePicker,
  Select,
  Button,
  Space,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { GetVendorMilkReport } from "../../../Service/ApiServices";
import { useUser } from "../../../Hooks/UserHook"; 

const { RangePicker } = DatePicker;

interface VendorReport {
  remaining_qty: number;
  vendor_sales_qty: number;
  distributor_taken_qty: number;
  distributor_return_qty: number;
  distributor_sales_qty: number;
}

const VendorMilkReport = () => {
  const [report, setReport] = useState<VendorReport | null>(null);
  const [loading, setLoading] = useState(false);
  const user = useUser(); 

  const [distributorId, setDistributorId] = useState<number>(
    user?.distributor_id ?? 0 
  );
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs(),
    dayjs(),
  ]);
  const [logType, setLogType] = useState<number>(0);

  useEffect(() => {
    fetchVendorReport();
  }, []);

  const fetchVendorReport = () => {
    if (!user?.token) {
      message.error("Authentication token missing");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("token", user.token);
    formData.append("distributor_id", String(distributorId));
    formData.append("from_date", dateRange[0].format("YYYY-MM-DD"));
    formData.append("to_date", dateRange[1].format("YYYY-MM-DD"));
    formData.append("log_type", String(logType));

    GetVendorMilkReport(formData)
      .then((res) => {
        if (res.data.status === 1) {
          setReport(res.data.data);
        } else {
          message.error(res.data.msg || "Failed to load vendor report");
          setReport(null);
        }
      })
      .catch((err) => {
        console.error("Error fetching vendor milk report:", err);
        message.error("Something went wrong while fetching the vendor report");
        setReport(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="p-3">
      <h2>Vendor Milk Report</h2>

      <Space wrap style={{ marginBottom: 16 }}>
        <span>
          Distributor ID:{" "}
          <InputNumber
            min={0}
            value={distributorId}
            onChange={(v) => setDistributorId(v ?? 0)}
          />
        </span>

        <span>
          Date Range:{" "}
          <RangePicker
            value={dateRange}
            onChange={(vals) =>
              setDateRange(
                vals && vals[0] && vals[1]
                  ? [vals[0], vals[1]]
                  : [dayjs(), dayjs()]
              )
            }
            format="YYYY-MM-DD"
          />
        </span>

        <span>
          Log Type:{" "}
          <Select<number>
            value={logType}
            onChange={(v) => setLogType(v)}
            style={{ width: 120 }}
          >
            <Select.Option value={0}>All</Select.Option>
            <Select.Option value={1}>In</Select.Option>
            <Select.Option value={2}>Out</Select.Option>
          </Select>
        </span>

        <Button type="primary" onClick={fetchVendorReport}>
          Fetch Report
        </Button>
      </Space>

      {/* Report */}
      {loading ? (
        <Spin />
      ) : report ? (
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Remaining Quantity (L)">
            {report.remaining_qty}
          </Descriptions.Item>
          <Descriptions.Item label="Vendor Sales (L)">
            {report.vendor_sales_qty}
          </Descriptions.Item>
          <Descriptions.Item label="Distributor Taken (L)">
            {report.distributor_taken_qty}
          </Descriptions.Item>
          <Descriptions.Item label="Distributor Return (L)">
            {report.distributor_return_qty}
          </Descriptions.Item>
          <Descriptions.Item label="Distributor Sales (L)">
            {report.distributor_sales_qty}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <p>No data to display</p>
      )}
    </div>
  );
};

export default VendorMilkReport;
