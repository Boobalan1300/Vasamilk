import type { ColumnType } from "../../Components/Table"; 

export const slotMappingColumns: ColumnType[] = [
  {
    title: "Slot Name",
    dataIndex: "slot_name",
    key: "slot_name",
  },
  {
    title: "Customer",
    dataIndex: "customer_name",
    key: "customer_name",
  },
  {
    title: "Distributor",
    dataIndex: "assigned_name",
    key: "assigned_name",
  },
  {
    title: "Scheduled Date",
    dataIndex: "scheduled_date",
    key: "scheduled_date",
  },
  {
    title: "Given Status",
    dataIndex: "milk_given_status",
    key: "milk_given_status",
    render: (text: string) => (
      <span style={{ color: text === "Missed" ? "red" : "green" }}>{text}</span>
    ),
  },
  {
    title: "Given Qty",
    dataIndex: "milk_given_quantity",
    key: "milk_given_quantity",
  },
  {
    title: "Actual Qty",
    dataIndex: "actual_milk_quantity",
    key: "actual_milk_quantity",
  },
  {
    title: "Unit Price",
    dataIndex: "unit_price",
    key: "unit_price",
    render: (val: number) => `₹${val}`,
  },
  {
    title: "Pay Mode",
    dataIndex: "user_pay_mode",
    key: "user_pay_mode",
    render: (mode: number) =>
      mode === 1 ? "Prepaid" : mode === 2 ? "Postpaid" : "N/A",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: number) => (status === 1 ? "Active" : "Inactive"),
  },
];
