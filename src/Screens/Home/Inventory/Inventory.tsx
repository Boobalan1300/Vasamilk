
import { useEffect, useState } from "react";
import { useToken } from "../../../Hooks/UserHook";
import { GetDailyInventoryReport } from "../../../Service/ApiServices";
import InventoryChart from "../Charts/InventoryChart";
import InventoryList from "./InventoryList";
import DailyMilkReport from "./DailyMilkReport";
import SimpleCard from "../../../Components/SimpleCard";
import { Images } from "../../../Utils/Images";
import { Row, Col } from "antd";


interface InventoryData {
  eve_slot_count: number;
  mrng_slot_count: number;
  total_inventory_count: number;
  mrng_data: { date: string; total_quantity: number }[];
  evening_data: { date: string; total_quantity: number }[];
}

const Inventory = () => {
  const [dailyInventory, setDailyInventory] = useState<InventoryData | null>(null);

  const token = useToken();

  useEffect(() => {
    if(token){
      handleGetDailyInventoryList(token);
    }
  }, [token]);

  const handleGetDailyInventoryList = (token:string) => {
    handleGetDailyInventoryReport(token);
  };

  const handleGetDailyInventoryReport = (token: string) => {
    const formData = new FormData();
    formData.append("token", token);

    GetDailyInventoryReport(formData)
      .then((res) => setDailyInventory(res.data.data[0]))
      .catch((err) => console.log("error", err));
  };

  return (
    <div className="container mb-2">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <SimpleCard
            title="Total Inventory Count"
            value={dailyInventory?.total_inventory_count ?? "--"}
            backgroundColor="#f6ffed"
            color="#00659b"
            icon={
              <span className="iconWrapper">
                <img
                  src={Images.milkBottle}
                  alt="dashboard"
                  className="pageIcon"
                />
              </span>
            }
          />
        </Col>

        <Col xs={24} sm={12} md={8}>
          <SimpleCard
            title="Evening Slot Count"
            value={dailyInventory?.eve_slot_count ?? "--"}
            backgroundColor="#e6f7ff"
            color="#1890ff"
            icon={
              <span className="iconWrapper">
                <img
                  src={Images.morning}
                  alt="dashboard"
                  className="pageIcon"
                />
              </span>
            }
          />
        </Col>

        <Col xs={24} sm={12} md={8}>
          <SimpleCard
            title="Morning Slot Count"
            value={dailyInventory?.mrng_slot_count ?? "--"}
            backgroundColor="#fffbe6"
            color="#faad14"
            icon={
              <span className="iconWrapper">
                <img
                  src={Images.evening}
                  alt="dashboard"
                  className="pageIcon"
                />
              </span>
            }
          />
        </Col>
      </Row>

      {dailyInventory ? (
        <div className="my-5">
          <InventoryChart data={dailyInventory} />
        </div>
      ) : (
        <p>Loading inventory chart</p>
      )}

      <DailyMilkReport />

      <InventoryList />

      {/* <VendorMilkReport/> */}

    </div>
  );
};

export default Inventory;
