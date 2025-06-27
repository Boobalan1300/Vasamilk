import React from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface SlotData {
  date: string;
  total_quantity: number;
}

interface InventoryChartProps {
  data: {
    mrng_data: SlotData[];
    evening_data: SlotData[];
  };
}

const InventoryChart: React.FC<InventoryChartProps> = ({ data }) => {
  const categories = data.mrng_data.map((item) => item.date.split("-")[0]);

  const allQuantities = [
    ...data.mrng_data.map((item) => item.total_quantity),
    ...data.evening_data.map((item) => item.total_quantity),
  ];
  const maxY = Math.max(...allQuantities, 0) + 100;

  const firstDate = data.mrng_data[0]?.date;
  let monthName = "Month";
  if (firstDate) {
    const monthIndex = parseInt(firstDate.split("-")[1], 10) - 1;
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    monthName = monthNames[monthIndex] ?? "Month";
  }

  const series = [
    {
      name: "Morning Quantity",
      data: data.mrng_data.map((item) => item.total_quantity),
    },
    {
      name: "Evening Quantity",
      data: data.evening_data.map((item) => item.total_quantity),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "line",
      zoom: { enabled: true },
      toolbar: { show: false },
    },
    colors: ["#4dabf7", "#ffa94d"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    title: {
      text: "Morning vs Evening Inventory ",
      align: "left",
      style: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#333",
      },
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    markers: { size: 1 },
    xaxis: {
      categories,
      title: {
        text: `Date (${monthName})`,
      },
      labels: {
        rotate: -45,
        style: { fontSize: "12px" },
      },
    },
    yaxis: {
      title: { text: "Quantity (Litres)" },
      min: 0,
      max: maxY,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
    responsive: [
      {
        breakpoint: 768,

        options: {
          dataLabels: { enabled: false },
          markers: { size: 0 },
          title: {
            style: {
              fontSize: "12px",
            },
          },
          chart: { height: 300 },
          legend: { position: "bottom", horizontalAlign: "center" },
          xaxis: {
            labels: {
              rotate: 0,
              style: { fontSize: "10px" },
            },
          },
        },
      },
    ],
  };

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={400}
      />
    </div>
  );
};

export default InventoryChart;
