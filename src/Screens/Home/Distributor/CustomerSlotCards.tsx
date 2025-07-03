import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "antd";
import { useUser, useToken } from "../../../Hooks/UserHook";
import { useLoader } from "../../../Hooks/useLoader";
import { GetSlotMapping } from "../../../Service/ApiServices";
import { toast } from "react-toastify";
import { TODAY } from "../../../Utils/Data/constants";
import CustomButton from "../../../Components/Button";

interface CustomerSlot {
  slot_log_id: number;
  customer_name: string;
  actual_milk_quantity: number;
  milk_given_quantity: number;
  milk_given_status: string;
}

const CustomerSlotCards: React.FC = () => {
  const [slotId, setSlotId] = useState<number>(1);
  const [givenData, setGivenData] = useState<CustomerSlot[]>([]);
  const [cancelledData, setCancelledData] = useState<CustomerSlot[]>([]);

  const token = useToken();
  const user = useUser();
  const distributorId = user?.user_id;
  const { showLoader, hideLoader } = useLoader();
  const date = TODAY.format("YYYY-MM-DD");
  const fetchSlots = () => {
    if (!token || !date || !distributorId) return;
    showLoader();

    const formData = new FormData();
    formData.append("token", token);
    formData.append("distributor_id", distributorId.toString());
    formData.append("slot_id", slotId.toString());
    formData.append("from_date", date);

    formData.set("status", "1,2,3");
    GetSlotMapping(formData)
      .then((res) => {
        if (res.data.status === 1) {
          setGivenData(res.data.data);
        } else {
          toast.error(res.data.msg || "Failed to fetch customer slots");
          setGivenData([]);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error fetching given/upcoming data");
        setGivenData([]);
      });

    const cancelParams = new FormData();
    formData.forEach((value, key) => cancelParams.append(key, value));
    cancelParams.set("status", "4");
    GetSlotMapping(cancelParams)
      .then((res) => {
        if (res.data.status === 1) {
          setCancelledData(res.data.data);
        } else {
          toast.error(res.data.msg || "Failed to fetch cancelled slots");
          setCancelledData([]);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error fetching cancelled data");
        setCancelledData([]);
      })
      .finally(() => {
        hideLoader();
      });
  };

  useEffect(() => {
    fetchSlots();
  }, [slotId, date]);

  return (
    <div>
      <Card className="my-4">
        <Row justify="space-between" align="middle" className="">
          <Col>
            <h5 className="mb-2">Select Slot</h5>
            <div>
              <CustomButton
                className={`py-1 px-2 me-2 ${
                  slotId === 1 ? "btn-selected-square" : "btn-light-grey-square"
                }`}
                onClick={() => setSlotId(1)}
              >
                Morning
              </CustomButton>
              <CustomButton
                className={`py-1 px-2 ${
                  slotId === 2 ? "btn-selected-square" : "btn-light-grey-square"
                }`}
                onClick={() => setSlotId(2)}
              >
                Evening
              </CustomButton>
            </div>
          </Col>
          <Col>
            <small className="text-muted">Date: {date}</small>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Given / Upcoming / Partially Given" className="mb-4">
            <Row gutter={[16, 16]}>
              {givenData.length > 0 ? (
                givenData.map((item) => (
                  <Col key={item.slot_log_id} xs={24} sm={12} lg={8}>
                    <Card
                      size="small"
                      className="shadow-sm border-0 rounded-3 h-100"
                      style={{backgroundColor:""}}
                    >
                      <div className="d-flex flex-column gap-2">
                        <h6 className="mb-0 fw-semibold text-grey">
                          {item.customer_name}
                        </h6>

                        <div className="d-flex justify-content-between small  border-top pt-2">
                          <span className="fw-semibold">Actual Qty:</span>
                          <span>{item.actual_milk_quantity} L</span>
                        </div>

                        <div className="d-flex justify-content-between small">
                          <span className="fw-semibold">Given Qty:</span>
                          <span>{item.milk_given_quantity} L</span>
                        </div>

                        <div className="d-flex justify-content-between small">
                          <span className="fw-semibold ">
                            Status:
                          </span>
                          <span
                            className={`fw-semibold ${
                              item.milk_given_status === "Given"
                                ? "text-success"
                                : item.milk_given_status === "Upcoming"
                                ? "text-warning"
                                : "text-danger"
                            }`}
                          >
                            {item.milk_given_status}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col xs={24}>
                  <p className="text-muted">No records found.</p>
                </Col>
              )}
            </Row>
          </Card>

          <Card title="Cancelled">
            {cancelledData.length > 0 ? (
              cancelledData.map((item) => (
                <div key={item.slot_log_id} className="border-bottom py-2">
                  <strong>{item.customer_name}</strong> - Actual Qty:{" "}
                  {item.actual_milk_quantity} L
                </div>
              ))
            ) : (
              <p className="text-muted">No cancelled slots.</p>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CustomerSlotCards;
