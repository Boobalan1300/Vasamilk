import React from "react";
import { Calendar, Card, Row, Col, Statistic } from "antd";
// import type { CalendarMode } from "antd/es/calendar/generateCalendar";
import dayjs, { Dayjs } from "dayjs";
import CustomTable from "../../../Components/CustomTable";

const DistributorDashboard: React.FC = () => {
  const today = dayjs();

//   const onPanelChange = (value: Dayjs, mode: CalendarMode) => {
//     console.log(value.format("YYYY-MM-DD"), mode);
//   };

  const disabledDate = (current: Dayjs) => {

    return current && current > today.endOf("day");
  };

  const tableColumns = [
    { title: "Customer", dataIndex: "customer", key: "customer" },
    { title: "Slot", dataIndex: "slot", key: "slot" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  const tableData = [
    {
      key: 1,
      customer: "Mohan",
      slot: "Morning",
      quantity: "5L",
      status: "Upcoming",
    },
    {
      key: 2,
      customer: "Jamal",
      slot: "Evening",
      quantity: "3L",
      status: "Missing",
    },
    {
      key: 3,
      customer: "Boobalan",
      slot: "Morning",
      quantity: "2L",
      status: "Cancelled",
    },
  ];

  return (
    <div className="container" >
      <Row gutter={[16,16]} >
        <Col xs={24} md={12}>
          <Card title="Select Date">
            <Calendar
              fullscreen={false}
              disabledDate={disabledDate}
            //   onPanelChange={onPanelChange}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card>
                <Statistic title="Total Milk Today" value="1000 L" />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic title="Morning Slot" value="600 L" />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic title="Evening Slot" value="400 L" />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic title="Routes to Cover" value={15} />
              </Card>
            </Col>
            <Col span={24}>
              <Card>
                <Statistic title="Number of Customers" value={120} />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Card
        title="Customer Slots Details"
        style={{ marginTop: 24 }}
      >
        <CustomTable columns={tableColumns} data={tableData} />
      </Card>
    </div>
  );
};

export default DistributorDashboard;
