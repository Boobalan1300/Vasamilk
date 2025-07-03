import React from "react";
import { Calendar } from "antd";
import type { CalendarProps } from "antd";
import  { Dayjs } from "dayjs";

interface CustomCalendarProps {
  value?: Dayjs;
  onChange?: CalendarProps<Dayjs>["onChange"];
  onPanelChange?: CalendarProps<Dayjs>["onPanelChange"];
  disabledDate?: (current: Dayjs) => boolean;
  fullscreen?: boolean;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  value,
  onChange,
  onPanelChange,
  disabledDate,
  fullscreen = false,
}) => {
  return (
    <Calendar
      value={value}
      onChange={onChange}
      onPanelChange={onPanelChange}
      disabledDate={disabledDate}
      fullscreen={fullscreen}
    />
  );
};

export default CustomCalendar;
