import React from "react";
import { Card } from "antd";

interface SimpleCardProps {
  title: string;
  value: number | string;
  backgroundColor?: string;
  color?: string;
  icon?: React.ReactNode;
}

const SimpleCard: React.FC<SimpleCardProps> = ({
  title,
  value,
    backgroundColor = "#ffffff",
  color = "#000000",
  icon,
}) => {
  return (
    <Card
      bordered={false}
      className="rounded-3 "
      style={{
        backgroundColor:backgroundColor,
        boxShadow: "rgba(100, 100, 111, 0.1) 0px 7px 29px 0px",
      }}
    >
      <p className="mb-3 fw-medium">{title}</p>

      <div className="d-flex align-items-center gap-3">
        {icon && (
          <div
            className="d-flex align-items-center justify-content-center"
          >
            {icon}
          </div>
        )}
        <h2 className="mb-0 fw-bold" style={{ fontSize: "18px", color }}>
          {value}
        </h2>
      </div>
    </Card>
  );
};

export default SimpleCard;
