import React from "react";
import { Pie } from "@ant-design/charts";

const PieChart = ({ data }) => {
  const config = {
    data: data,
    angleField: "value",
    colorField: "type",
    label: {
      text: "value",
      style: {
        fontWeight: "bold",
      },
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
  };
  return <Pie {...config} />;
};

export default PieChart;
