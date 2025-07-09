import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GetMilkDailyReport } from "../../../Service/ApiServices";
import { useToken } from "../../../Hooks/UserHook";
import CustomButton from "../../../Components/Button";
import { Card, Tag, Spin, Row, Col } from "antd";

const DailyMilkReport = () => {
  const [inData, setInData] = useState<{ [slotId: number]: number }>({});
  const [outData, setOutData] = useState<{ [slotId: number]: number }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = useToken();

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = () => {
    if (!token) {
      toast.error("Authentication token missing");
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

          res.data.data.forEach((item: any) => {
            const qty = parseFloat(item.total_quantity);
            const slotId = item.slot_id;
            const type = item.given_type;

            if (type === 1) {
              inResult[slotId] = (inResult[slotId] || 0) + qty;
            } else if (type === 2) {
              outResult[slotId] = (outResult[slotId] || 0) + qty;
            }
          });

          setInData(inResult);
          setOutData(outResult);
        } else {
          toast.error(res.data.msg || "Failed to load report");
        }
      })
      .catch(() => {
        toast.error("Something went wrong while fetching the report");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderCard = (
    title: string,
    color: string,
    quantity: number,
    slotId: number,
    givenType: number
  ) => (
    <Col xs={24} md={12} lg={12} xl={6}>
      <Card
        title={<Tag color={color}>{title}</Tag>}
        
        hoverable
        extra={
          <CustomButton
            className=" px-1 py-1 light-grey-button"
            onClick={() =>
              navigate("/listslotMap", { state: { slotId, givenType } })
            }
          >
            View Slots
          </CustomButton>
        }
      >
        <p>
          <strong>Quantity:</strong> {quantity ?? 0} L
        </p>
      </Card>
    </Col>
  );

  return (
    <div className="p-3">
      <h2 className="mb-4">Daily Milk Required Report</h2>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[16, 16]}>
          {renderCard("Morning - Vendor", "green", inData[1] || 0, 1, 1)}
          {renderCard("Evening - Vendor", "blue", inData[2] || 0, 2, 1)}
          {renderCard("Morning - Distributor", "red", outData[1] || 0, 1, 2)}
          {renderCard("Evening - Distributor", "purple", outData[2] || 0, 2, 2)}
        </Row>
      )}
    </div>
  );
};

export default DailyMilkReport;
