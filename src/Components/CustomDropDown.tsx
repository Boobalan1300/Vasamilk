


import { useEffect, useState } from "react";
import { Select, message } from "antd";
import {
  fetchLinesDropDown,
  fetchPriceTagDropDown,
  GetDistributorWithLines,
  GetCustomers,
} from "../Service/ApiServices";
import { useToken } from "../Hooks/UserHook";

const { Option } = Select;

interface ReusableDropdownsProps {
  dropdownKeys: string[];
  formik: any;
  className?: string;
  customerType?: "1" | "2" | "3" | "4";
  onCustomersLoaded?: (customers: any[]) => void; 
  
}

const UserDropDown = [
  { label: "Admin", value: "2" },
  { label: "Vendor/logger", value: "3" },
  { label: "Distributor", value: "4" },
  { label: "Customer", value: "5" },
];

export const CustomerType = [
  { label: "Regular", value: "1" },
  { label: "Occasional", value: "2" },
];

export const PayTypesOptions = [
  { label: "Daily", value: "1" },
  { label: "Monthly", value: "2" },
];

const StatusOptions = [
  { label: "Active", value: "1" },
  { label: "Inactive", value: "2" },
];

const TypeOptions = [
  { label: "In", value: 1 },
  { label: "Out", value: 2 },
];

const SlotOptions = [
  { label: "Morning", value: "1" },
  { label: "Evening", value: "2" },
];

const AssignTypeOptions = [
  { label: "Permanent", value: "1" },
  { label: "Temporary", value: "0" },
];

const CustomDropDown: React.FC<ReusableDropdownsProps> = ({
  dropdownKeys,
  formik,
  className = "col-12 col-md-6 col-lg-2 mb-3",
  customerType,
  onCustomersLoaded,
}) => {
  const token = useToken();
  const [linesList, setLinesList] = useState<any[]>([]);
  const [priceTagList, setPriceTagList] = useState<any[]>([]);
  const [distributorsList, setDistributorsList] = useState<any[]>([]);
  const [customersList, setCustomersList] = useState<any[]>([]);
  const [loadingLines, setLoadingLines] = useState(false);
  const [loadingPriceTags, setLoadingPriceTags] = useState(false);
  const [loadingDistributors, setLoadingDistributors] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  const { values, setFieldValue, touched, errors } = formik;

  useEffect(() => {
    if (!token) return;

    if (dropdownKeys.includes("line_id")) fetchLines();
    if (dropdownKeys.includes("price_tag_id")) fetchPriceTags();
    if (dropdownKeys.includes("distributer_id")) fetchDistributors();
    if (dropdownKeys.includes("customers")) fetchCustomers();
  }, []);

  const fetchLines = (userType: number | string = "5") => {
    if (!token) return;
    setLoadingLines(true);

    const formData = new FormData();
    formData.append("token", token);

    const numericType = parseInt(userType as string, 10);
    const type = numericType === 4 ? 2 : 1;
    formData.append("type", type.toString());

    fetchLinesDropDown(formData)
      .then((res) => setLinesList(res.data.data || []))
      .catch(() => message.error("Failed to load lines."))
      .finally(() => setLoadingLines(false));
  };

  const fetchPriceTags = () => {
    if (!token) return;
    setLoadingPriceTags(true);

    const formData = new FormData();
    formData.append("token", token);

    fetchPriceTagDropDown(formData)
      .then((res) => setPriceTagList(res.data.data || []))
      .catch(() => message.error("Failed to load price tags."))
      .finally(() => setLoadingPriceTags(false));
  };

  const fetchDistributors = () => {
    if (!token) return;
    setLoadingDistributors(true);

    const formData = new FormData();
    formData.append("token", token);

    GetDistributorWithLines(formData)
      .then((res) => {
        if (res.data.status === 1) {
          setDistributorsList(res.data.data || []);
        } else {
          message.error(res.data.msg || "Failed to fetch distributors.");
        }
      })
      .catch(() => message.error("Error fetching distributors."))
      .finally(() => setLoadingDistributors(false));
  };

  const fetchCustomers = () => {
    if (!token) return;
    setLoadingCustomers(true);

    const formData = new FormData();
    formData.append("token", token);

    if (customerType) formData.append("type", customerType);

    GetCustomers(formData)
      .then((res) => {
        if (res.data.status === 1) {
          setCustomersList(res.data.data || []);
          onCustomersLoaded?.(res.data.data || []); 
        } else {
          message.error(res.data.msg || "Failed to fetch customers.");
          setCustomersList([]);
          onCustomersLoaded?.([]);
        }
      })
      .catch(() => {
        message.error("Error fetching customers.");
        setCustomersList([]);
        onCustomersLoaded?.([]);
      })
      .finally(() => setLoadingCustomers(false));
  };

const renderSelect = (
  name: string,
  placeholder: string,
  options: any[],
  loading: boolean = false
) => (
  <div className={className} key={name}>
    <label>{placeholder}</label>
    <Select
      allowClear
      style={{ width: "100%" }}
      className={`${errors[name] && touched[name] ? "is-invalid" : ""}`}
      value={values[name] ? String(values[name]) : undefined} // 👈 Stringified value
      placeholder={`Select ${placeholder.toLowerCase()}`}
      loading={loading}
      onChange={(val) => setFieldValue(name, val ?? "")}
      onBlur={() => formik?.handleBlur?.({ target: { name } })}
      showSearch
      optionFilterProp="children"
     filterOption={(input, option) =>
          (option?.children as unknown as string)
            .toLowerCase()
            .includes(input.toLowerCase())
        }
    >
      {options
        .filter(
          (opt, idx, self) =>
            opt.value !== undefined &&
            idx === self.findIndex(
              (o) => String(o.value) === String(opt.value)
            )
        )
        .map((opt, idx) => (
          <Option
            key={String(opt.value ?? `${name}-${idx}`)}
            value={String(opt.value ?? `${name}-${idx}`)} 
          >
            {opt.label}
          </Option>
        ))}
    </Select>
    {errors[name] && touched[name] && typeof errors[name] === "string" && (
      <div className="text-danger">{errors[name]}</div>
    )}
  </div>
);


  return (
    <div className="row mt-3">
      {dropdownKeys.includes("user_type") &&
        renderSelect("user_type", "User Type", UserDropDown)}
      {dropdownKeys.includes("customer_type") &&
        renderSelect("customer_type", "Customer Type", CustomerType)}
      {dropdownKeys.includes("line_id") &&
        renderSelect(
          "line_id",
          "Line",
          linesList.map((l, idx) => ({
            label: l.line_name || `Line ${idx + 1}`,
            value: l.id ?? `line-${idx + 1}`,
          })),
          loadingLines
        )}
      {dropdownKeys.includes("price_tag_id") &&
        renderSelect(
          "price_tag_id",
          "Price Tag",
          priceTagList.map((p, idx) => ({
            label: p.price_tag_name || `Price Tag ${idx + 1}`,
            value: p.id ?? `price-${idx + 1}`,
          })),
          loadingPriceTags
        )}
      {dropdownKeys.includes("distributer_id") &&
        renderSelect(
          "distributer_id",
          "Distributor",
          distributorsList.map((d, idx) => ({
            label: `${d.distributer_name} - ${d.phone_number}`,
            value: d.distributer_id
              ? String(d.distributer_id)
              : `distributor-${idx + 1}`,
          })),
          loadingDistributors
        )}
      {dropdownKeys.includes("pay_type") &&
        renderSelect("pay_type", "Pay Type", PayTypesOptions)}
      {dropdownKeys.includes("status") &&
        renderSelect("status", "Status", StatusOptions)}
      {dropdownKeys.includes("type") &&
        renderSelect("type", "Type", TypeOptions)}
      {dropdownKeys.includes("slot_id") &&
        renderSelect("slot_id", "Slot", SlotOptions)}
      {dropdownKeys.includes("assign_type") &&
        renderSelect("assign_type", "Assign Type", AssignTypeOptions)}
      {dropdownKeys.includes("customers") &&
        renderSelect(
          "customers",
          "Customers",
          customersList.map((c) => ({
            label: c.name,
            value: String(c.user_id),
          })),
          loadingCustomers
        )}
    </div>
  );
};

export default CustomDropDown;
