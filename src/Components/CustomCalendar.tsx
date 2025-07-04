import React from "react";
import { Calendar, Select } from "antd";
import type { CalendarProps } from "antd";
import dayjs, { Dayjs } from "dayjs";

interface CustomCalendarProps {
  value?: Dayjs;
  onChange?: CalendarProps<Dayjs>["onChange"];
  onPanelChange?: CalendarProps<Dayjs>["onPanelChange"];
  disabledDate?: (current: Dayjs) => boolean;
  fullscreen?: boolean;
  validRange?: [Dayjs, Dayjs];
  headerMode?: "default" | "custom" | "none";
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  value,
  onChange,
  onPanelChange,
  disabledDate,
  fullscreen = false,
  validRange,
  headerMode = "custom",
}) => {
  const customHeaderRender: CalendarProps<Dayjs>["headerRender"] = ({
    value: headerValue,
    onChange: headerOnChange,
  }) => {
    if (!validRange) return null;

    const startYear = validRange[0].year();
    const endYear = validRange[1].year();

    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => ({
      label: startYear + i,
      value: startYear + i,
    }));

    const currentYear = headerValue.year();
    const maxMonth = currentYear === endYear ? validRange[1].month() : 11;

    const months = Array.from({ length: maxMonth + 1 }, (_, i) => ({
      label: dayjs().month(i).format("MMMM"),
      value: i,
    }));

    return (
      <div style={{ display: "flex", gap: 8, padding: "8px 16px" }}>
        <Select
          size="small"
          value={currentYear}
          options={years}
          onChange={(newYear) =>
            headerOnChange(headerValue.clone().year(newYear))
          }
          style={{ width: 100 }}
        />
        <Select
          size="small"
          value={headerValue.month()}
          options={months}
          onChange={(newMonth) =>
            headerOnChange(headerValue.clone().month(newMonth))
          }
          style={{ width: 140 }}
        />
      </div>
    );
  };

  const headerRenderProp =
    headerMode === "custom"
      ? customHeaderRender
      : headerMode === "none"
      ? () => null
      : undefined;

  return (
    <Calendar
      value={value}
      onChange={onChange}
      onPanelChange={onPanelChange}
      disabledDate={disabledDate}
      fullscreen={fullscreen}
      validRange={validRange}
      headerRender={headerRenderProp}
    />
  );
};

export default CustomCalendar;

// newMonth - month index
// headerValue - current calendar’s Dayjs date, e.g., 2025-07-01.

//  onChange
// If the user picks 3 in the month dropdown (April, since months are 0-indexed: 0=January, 3=April, 11=December):
// headerValue.clone().month(3) ➔ new Dayjs date becomes 2025-04-01.
// This new date with the updated month is passed to headerOnChange(...), updating the calendar to April 2025.
