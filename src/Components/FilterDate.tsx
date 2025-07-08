import React from "react";
import { DatePicker, Col } from "antd";
import dayjs from "dayjs";

interface FilterDateProps {
  fromDate: string;
  toDate: string;
  onChange: (dates: { from_date: string; to_date: string }) => void;
}

const FilterDate: React.FC<FilterDateProps> = ({ fromDate, toDate, onChange }) => {
  const handleFromDateChange = (date: any) => {
    const formatted = date ? dayjs(date).format("YYYY-MM-DD") : "";
    onChange({ from_date: formatted, to_date: toDate });
  };

  const handleToDateChange = (date: any) => {
    const formatted = date ? dayjs(date).format("YYYY-MM-DD") : "";
    onChange({ from_date: fromDate, to_date: formatted });
  };

  return (
    <>
      <Col xs={24} sm={12} md={6}>
        <label className="form-label">From Date</label>
        <DatePicker
          format="YYYY-MM-DD"
          style={{ width: "100%" }}
          value={fromDate ? dayjs(fromDate) : null}
          onChange={handleFromDateChange}
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <label className="form-label">To Date</label>
        <DatePicker
          format="YYYY-MM-DD"
          style={{ width: "100%" }}
          value={toDate ? dayjs(toDate) : null}
          onChange={handleToDateChange}
        />
      </Col>
    </>
  );
};

export default FilterDate;
