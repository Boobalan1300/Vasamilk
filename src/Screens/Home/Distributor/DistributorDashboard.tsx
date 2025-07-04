import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "antd";
import CustomCalendar from "../../../Components/CustomCalendar";
import { TODAY } from "../../../Utils/Data/constants";
import { Dayjs } from "dayjs";
import { useUser, useToken } from "../../../Hooks/UserHook";
import { useLoader } from "../../../Hooks/useLoader";
import {
  GetReportByDate,
  fetchLinesDropDown,
} from "../../../Service/ApiServices";
import { toast } from "react-toastify";
import CustomerSlotCards from "./CustomerSlotCards";

const DistributorDashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(TODAY);
  const [reportData, setReportData] = useState<any>(null);
  const [lines, setLines] = useState<string[]>([]);

  const token = useToken();
  const user = useUser();
  const distributorId = user?.user_id;
  const { showLoader, hideLoader } = useLoader();

  const disabledDate = (current: Dayjs) =>
    current && current > TODAY.endOf("day");

  const currentYear = TODAY.year();
  const startYear = currentYear - 4;
  const start = TODAY.set("year", startYear).startOf("year");
  const end = TODAY.endOf("month");

  const fetchData = (date: Dayjs) => {
    if (!token) return;
    showLoader();
    const formattedDate = date.format("YYYY-MM-DD");

    const reportForm = new FormData();
    reportForm.append("token", token);
    reportForm.append("from_date", formattedDate);
    const reportPromise = GetReportByDate(reportForm);

    const linesForm = new FormData();
    linesForm.append("token", token);
    linesForm.append("type", "2");
    linesForm.append(
      "distributer_id",
      distributorId !== undefined ? distributorId.toString() : ""
    );
    linesForm.append("from_date", formattedDate);
    const linesPromise = fetchLinesDropDown(linesForm);

    Promise.all([reportPromise, linesPromise])
      .then(([reportResponse, linesResponse]) => {
        if (reportResponse.data.status === 1) {
          setReportData(reportResponse.data);
        } else {
          toast.error(reportResponse.data.msg || "Failed to fetch report");
          setReportData(null);
        }

        if (linesResponse.data.status === 1) {
          const lineNames = linesResponse.data.data.map(
            (line: any) => line.line_name
          );
          setLines(lineNames);
        } else {
          toast.error(linesResponse.data.msg || "Failed to fetch lines");
          setLines([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        toast.error("Error fetching data");
        setReportData(null);
        setLines([]);
      })
      .finally(() => {
        hideLoader();
      });
  };

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);

  return (
    <div className="container py-3">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Select Date">
            <CustomCalendar
              disabledDate={disabledDate}
              value={selectedDate}
              onChange={(date) => date && setSelectedDate(date)}
              validRange={[start, end]}
              headerMode="custom"
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <p className="mb-3 fs-10 ">
            Selected Date:{" "}
            <span className="text-grey">
              {selectedDate.format("DD MMM YYYY")}
            </span>
          </p>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Card className="h-100">
                <h6 className="text-muted mb-1">Total Milk Morning</h6>
                <p className="h4 mb-2 fw-bold font-grey">
                  {reportData?.data?.find((r: any) => r.slot_id === 1)
                    ?.total_quantity || "0 L"}
                </p>
                <h6 className="text-muted mb-1">Given (Used)</h6>
                <p className="h4 fw-bold text-success">
                  {reportData?.data?.find((r: any) => r.slot_id === 1)
                    ?.given_quantity || "0 L"}
                </p>
              </Card>
            </Col>

            <Col xs={24} sm={12}>
              <Card className="h-100">
                <h6 className="text-muted mb-1 ">Total Milk Evening</h6>
                <p className="h4 mb-2 fw-bold font-grey">
                  {reportData?.data?.find((r: any) => r.slot_id === 2)
                    ?.total_quantity || "-"}
                </p>
                <h6 className="text-muted mb-1">Given (Used)</h6>
                <p className="h4 fw-bold text-success">
                  {reportData?.data?.find((r: any) => r.slot_id === 2)
                    ?.given_quantity || "-"}
                </p>
              </Card>
            </Col>

            <Col xs={24} sm={12}>
              <Card className="h-100">
                <h6 className="text-muted mb-1">
                  Remaining (both morning/evening)
                </h6>
                <p className="h4 fw-bold text-warning">
                  {reportData?.current_hold_quantity !== undefined
                    ? `${parseFloat(reportData.current_hold_quantity)} L`
                    : "-"}
                </p>
              </Card>
            </Col>

            <Col xs={24} sm={12}>
              <Card className="h-100">
                <h6 className="text-muted mb-2">Routes Names</h6>
                {lines.length ? (
                  <ul className="list-group list-group-flush">
                    {lines.map((line, idx) => (
                      <li
                        key={idx}
                        className="list-group-item p-2 border-0 font-grey"
                      >
                        <span className="fw-semibold">{line}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="h5 fw-semibold text-danger mb-0">No routes</p>
                )}
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <CustomerSlotCards />
    </div>
  );
};

export default DistributorDashboard;
