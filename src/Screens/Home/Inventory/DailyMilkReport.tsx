


import { useEffect, useState } from "react";
import { Card, Tag, Spin, message, Row, Col, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../../Utils/Cookie";
import { GetMilkDailyReport } from "../../../Service/ApiServices";
import AddDistributorLogModal from "../../../Modal/AddDistributorLog";

const DailyMilkReport = () => {
  const [inData, setInData] = useState<{ [slotId: number]: number }>({});
  const [outData, setOutData] = useState<{ [slotId: number]: number }>({});
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasActiveSlot, setHasActiveSlot] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = () => {
    const token = getUser()?.token;
    if (!token) {
      message.error("Authentication token missing");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("token", token);

    GetMilkDailyReport(formData)
      .then((res) => {
        if (res.data.status === 1) {
          const inResult: { [slotId: number]: number } = {};
          const outResult: { [slotId: number]: number } = {};
          let active = false;

          res.data.data.forEach((item: any) => {
            const qty = parseFloat(item.total_quantity);
            const available = parseFloat(item.available_quantity || "0");
            const slotId = item.slot_id;
            const type = item.given_type;

            if (type === 1) {
              inResult[slotId] = (inResult[slotId] || 0) + qty;
            } else if (type === 2) {
              outResult[slotId] = (outResult[slotId] || 0) + qty;
            }

            if (available > 0) {
              active = true;
            }
          });

          setInData(inResult);
          setOutData(outResult);
          setHasActiveSlot(active);
        } else {
          message.error(res.data.msg || "Failed to load report");
        }
      })
      .catch((err) => {
        console.error("Error fetching daily milk report:", err);
        message.error("Something went wrong while fetching the report");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getSlotLabel = (slotId: number) => {
    if (slotId === 1) return "Morning";
    if (slotId === 2) return "Evening";
    return `Slot ${slotId}`;
  };

  const renderCard = (
    title: string,
    color: string,
    data: { [slotId: number]: number },
    showLogButton: boolean = false
  ) => (
    <Col xs={24} md={12}>
      <Card
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Tag color={color}>{title}</Tag>
            {showLogButton && (
              // <Button type="primary" size="small" onClick={() => navigate("/distributorLog")}>
              //   Go to Distribution Log
              // </Button>

              <Button type="primary" size="small" onClick={() => navigate("/listslotMap")}>
                list slot Mapping
              </Button>
            )}
          </div>
        }
        bordered
        hoverable
      >
        {Object.entries(data).map(([slotId, quantity]) => (
          <p key={slotId}>
            <strong>{getSlotLabel(Number(slotId))}:</strong> {quantity} L
          </p>
        ))}
      </Card>
    </Col>
  );

  return (
    <div className="p-3">
      <h2 className="mb-4">Daily Milk Required Report</h2>

      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={() => setIsModalOpen(true)}
          disabled={!hasActiveSlot}
        >
          Add Log
        </Button>
      </div>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[16, 16]}>
          {renderCard("In (Received)", "green", inData)}
          {renderCard("Out (Distributed)", "red", outData, true)}
        </Row>
      )}

      <AddDistributorLogModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchReport}
      />
    </div>
  );
};

export default DailyMilkReport;
