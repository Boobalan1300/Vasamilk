import {
  fetchLinesDropDown,
  fetchPriceTagDropDown,
} from "../Service/ApiServices";
import { getUser } from "./Cookie";

const getToken = (): string | undefined => {
  const user = getUser();
  return user?.token;
};

export const LineData = async (userType: number | string = "5") => {
  const token = getToken();
  if (!token) return [];

  try {
    const formData = new FormData();
    formData.append("token", token);

    const numericType = parseInt(userType as string, 10);
    const type = numericType === 4 ? 2 : 1;
    formData.append("type", type.toString());

    const res = await fetchLinesDropDown(formData);
    // console.log("line", res.data.data);
    return res.data.data || [];
  } catch (error) {
    console.error("Error fetching line data:", error);
    return [];
  }
};


export const PriceTagData = async () => {
  const token = getToken();
  if (!token) return [];

  try {
    const formData = new FormData();
    formData.append("token", token);
    const res = await fetchPriceTagDropDown(formData);
     console.log("price data array:", res.data.data);
    return res.data.data || [];
  } catch (error) {
    console.error("Error fetching price tag data:", error);
    return [];
  }
};

export const UserDropDown = [
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

export const StatusOptions = [
  { label: "Active", value: "1" },
  { label: "Inactive", value: "2" },
];
