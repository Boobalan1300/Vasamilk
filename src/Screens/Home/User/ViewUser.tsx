import { Card, Descriptions, Divider, Tag } from "antd";
import CustomTable from "../../../Components/CustomTable";

const ViewUser = ({ data }: { data: any }) => {
  if (!data) return null;

  const userTypeMap: any = {
    1: "Admin",
    2: "Vendor",
    3: "Distributor",
    4: "Customer",
    5: "Customer",
  };

  const customerTypeMap: any = {
    1: "Regular",
    2: "Occasional",
  };

  const payTypeMap: any = {
    1: "Daily",
    2: "Monthly",
  };

  const slotColumns = [
    { title: "Slot", dataIndex: "slot_id", key: "slot_id" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Method", dataIndex: "method", key: "method" },
    { title: "Start Date", dataIndex: "start_date", key: "start_date" },
  ];

  return (
    <Card bordered className="mb-4">
      <Descriptions title="User Details" bordered column={2} size="small">
        <Descriptions.Item label="User ID">{data.user_id}</Descriptions.Item>
        <Descriptions.Item label="Username">{data.user_name}</Descriptions.Item>
        <Descriptions.Item label="Name">{data.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{data.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{data.phone}</Descriptions.Item>
        <Descriptions.Item label="Alt. Number">
          {data.alternative_number}
        </Descriptions.Item>
        <Descriptions.Item label="User Type">
          {userTypeMap[data.user_type]}
        </Descriptions.Item>
        <Descriptions.Item label="Customer Type">
          {customerTypeMap[data.customer_type]}
        </Descriptions.Item>
        <Descriptions.Item label="Pay Type">
          {payTypeMap[data.pay_type]}
        </Descriptions.Item>
        <Descriptions.Item label="Line">{data.line_name}</Descriptions.Item>
        <Descriptions.Item label="Price Tag">
          {data.price_tag_name}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          {data.status === 1 ? (
            <Tag color="green">Active</Tag>
          ) : (
            <Tag color="red">Inactive</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Created At" span={2}>
          {data.created_at}
        </Descriptions.Item>
      </Descriptions>

      {data.slot_data?.length > 0 && (
        <>
          <Divider orientation="left">Slot Details</Divider>
          <CustomTable
            data={data.slot_data}
            columns={slotColumns}
            rowKey="id"
          />
        </>
      )}
    </Card>
  );
};

export default ViewUser;
