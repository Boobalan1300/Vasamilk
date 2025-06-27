import React, { useEffect, useState } from "react";
import { Select, Button, Space, Spin, message } from "antd";
import {
  CustomerType,
  PayTypesOptions,
  PriceTagData,
  UserDropDown,
  StatusOptions,
  LineData,
} from "../../../Utils/UserDropDown";

const { Option } = Select;

interface OptionType {
  label: string;
  value: string;
}

interface FilterValues {
  pay_type?: string;
  customer_type?: string;
  user_type?: string;
  line_id?: string;
  price_tag_id?: string;
  status?: string;
}

interface FilterProps {
  filters: FilterValues;
  loading: boolean;
  onFilterChange: (field: keyof FilterValues, value: string | null) => void;
  onExportFilters: () => void;
  onResetFilters: () => void;
}

const UserFilter: React.FC<FilterProps> = ({
  filters,
  loading,
  onFilterChange,
  onExportFilters,
  onResetFilters,
}) => {
  const [priceTagOptions, setPriceTagOptions] = useState<OptionType[]>([]);
  const [lineOptions, setLineOptions] = useState<OptionType[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    const fetchDropdowns = async () => {
      setLoadingDropdowns(true);
      try {
        const [priceTags, lines] = await Promise.all([
          PriceTagData(),
          LineData(),
        ]);

        setPriceTagOptions(
          priceTags?.map((item: any) => ({
            label: item.price_tag_name,
            value: item.id.toString(),
          })) || []
        );

        setLineOptions(
          lines?.map((item: any) => ({
            label: item.line_name,
            value: item.id.toString(),
          })) || []
        );
        console.log("line", lines);
      } catch (error) {
        message.error("Failed to load dropdowns");
      } finally {
        setLoadingDropdowns(false);
      }
    };

    fetchDropdowns();
  }, [filters.user_type]);

  return (
    <Space style={{ marginBottom: 16, flexWrap: "wrap" }} size="middle" wrap>
      <Select
        placeholder="User Type"
        allowClear
        style={{ width: 140 }}
        value={filters.user_type}
        onChange={(val) => onFilterChange("user_type", val)}
      >
        {UserDropDown.map((item) => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>

      <Select
        placeholder="Status"
        allowClear
        style={{ width: 140 }}
        value={filters.status}
        onChange={(val) => onFilterChange("status", val)}
      >
        {StatusOptions.map((item) => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>

      <Select
        placeholder="Pay Type"
        allowClear
        style={{ width: 140 }}
        value={filters.pay_type}
        onChange={(val) => onFilterChange("pay_type", val)}
      >
        {PayTypesOptions.map((item) => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>

      <Select
        placeholder="Customer Type"
        allowClear
        style={{ width: 140 }}
        value={filters.customer_type}
        onChange={(val) => onFilterChange("customer_type", val)}
      >
        {CustomerType.map((item) => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>

      <Select
        placeholder="Line Name"
        allowClear
        style={{ width: 140 }}
        value={filters.line_id}
        onChange={(val) => onFilterChange("line_id", val)}
        loading={loadingDropdowns}
      >
        {lineOptions.map((item) => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>

      <Select
        placeholder="Price Tag"
        allowClear
        style={{ width: 140 }}
        value={filters.price_tag_id}
        loading={loadingDropdowns}
        onChange={(val) => onFilterChange("price_tag_id", val)}
      >
        {priceTagOptions.map((item) => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>

      <Button type="primary" onClick={onExportFilters}>
        Filter
      </Button>
      <Button onClick={onResetFilters}>Reset</Button>
      {loading && <Spin size="small" />}
    </Space>
  );
};

export default UserFilter;
