
import React, { useEffect, useState } from "react";
import { Row, Col, Select } from "antd";
import { toast } from "react-toastify";
import { useToken } from "../../../Hooks/UserHook";
import { GetVendorMilkReport } from "../../../Service/ApiServices";
import FilterDate from "../../../Components/FilterDate";
import { TODAY_DATE } from "../../../Utils/Data/constants";
import DistributorLog from "./DistributorLog";
import SimpleCard from "../../../Components/SimpleCard";



const Sales: React.FC = () => {
  const token = useToken();
  const [selectedType, setSelectedType] = useState("vendor");
  const [fromDate, setFromDate] = useState(TODAY_DATE);
  const [toDate, setToDate] = useState(TODAY_DATE);
  const [reportData, setReportData] = useState<any>({});

  const fetchReport = () => {
    if (!token || !fromDate || !toDate) return;

    const formData = new FormData();
    formData.append("token", token);
    formData.append("from_date", fromDate);
    formData.append("to_date", toDate);

    GetVendorMilkReport(formData)
      .then((res) => {
        if (res.data.status === 1) {
          setReportData(res.data.data);
        } else {
          toast.error(res.data.msg || "Failed to fetch report data");
        }
      })
      .catch(() => toast.error("Something went wrong"));
  };

  useEffect(() => {
    fetchReport();
  }, [selectedType, fromDate, toDate]);

  return (
    <div className="container py-3">
      <h3 className="mb-3">Milk Sales Report</h3>
      <Row gutter={[16, 16]} className="mb-3" align="middle">
        <Col xs={24} sm={12}>
          <label className="form-label">Report Type</label>
          <Select
            value={selectedType}
            onChange={(val) => setSelectedType(val)}
            style={{ width: "100%" }}
            options={[
              { label: "Vendor", value: "vendor" },
              { label: "Distributor", value: "distributor" },
            ]}
          />
        </Col>

        <FilterDate
          fromDate={fromDate}
          toDate={toDate}
          onChange={({ from_date, to_date }) => {
            setFromDate(from_date);
            setToDate(to_date);
          }}
        />
      </Row>

      <Row gutter={[16, 16]} className="mt-3">
        {selectedType === "vendor" && (
          <>
            <Col xs={24} sm={12} md={6}>
              <SimpleCard
                title="Remaining Qty"
                value={`${reportData.remaining_qty ?? 0} L`}
                backgroundColor="#e0f7fa"
                color="#006064"
              />
            </Col>

            <Col xs={24} sm={12} md={6}>
              <SimpleCard
                title="Vendor Sales Qty"
                value={`${reportData.vendor_sales_qty ?? 0} L`}
                backgroundColor="#fce4ec"
                color="#880e4f"
              />
            </Col>
          </>
        )}

        {selectedType === "distributor" && (
          <>
            <Col xs={24} sm={12} md={6}>
              <SimpleCard
                title="Distributor Taken Qty"
                value={`${reportData.distributor_taken_qty ?? 0} L`}
                backgroundColor="#fff3e0"
                color="#e65100"
              />
            </Col>

            <Col xs={24} sm={12} md={6}>
              <SimpleCard
                title="Distributor Return Qty"
                value={`${reportData.distributor_return_qty ?? 0} L`}
                backgroundColor="#ede7f6"
                color="#4527a0"
              />
            </Col>

            <Col xs={24} sm={12} md={6}>
              <SimpleCard
                title="Distributor Sales Qty"
                value={`${reportData.distributor_sales_qty ?? 0} L`}
                backgroundColor="#e8f5e9"
                color="#1b5e20"
              />
            </Col>
          </>
        )}
      </Row>

      <DistributorLog
        fromDate={fromDate}
        toDate={toDate}
        logType={selectedType === "vendor" ? 2 : 1}
      />
    </div>
  );
};

export default Sales;
