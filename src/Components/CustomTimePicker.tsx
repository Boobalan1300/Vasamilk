import React from "react";
import { TimePicker } from "antd";
import { Dayjs } from "dayjs";

type Props = {
  label: string;
  name: string;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
  error?: string;
  touched?: boolean;
  format?: string; // optional override
};

const CustomTimePicker: React.FC<Props> = ({
  label,
  name,
  value,
  onChange,
  error,
  touched,
  format = "HH:mm:ss",
}) => (
  <div>
    <label className="form-label">{label}</label>
    <TimePicker
      name={name}
      value={value}
      onChange={onChange}
      format={format}
      className="w-100"
    />
    {touched && error && (
      <div className="text-danger">{error}</div>
    )}
  </div>
);

export default CustomTimePicker;
