import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function(props: LineChartProperties) {
  const { data, yAxis, xAxis, lineStroke, gridStroke } = props;

  function getLinesForChart() {
    return yAxis
      .split(";")
      .map((label, index) => (
        <Line
          type="monotone"
          dataKey={label}
          stroke={lineStroke.split(";")[index]}
        />
      ));
  }

  return (
    <ResponsiveContainer>
      <LineChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
        {getLinesForChart()}
        <CartesianGrid stroke={gridStroke} strokeDasharray="5 5" />
        <XAxis dataKey={xAxis} tick={{ fill: "#00463f", fontSize: "10px" }} />
        <YAxis />
        <Tooltip />
        <Legend iconType={"line"} height={20} width={300} iconSize={15} />
      </LineChart>
    </ResponsiveContainer>
  );
}

type LineChartProperties = {
  data: any;
  xAxis: string;
  yAxis: string;
  lineStroke: string;
  gridStroke: string;
};
