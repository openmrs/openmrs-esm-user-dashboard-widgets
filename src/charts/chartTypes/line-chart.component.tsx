import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

export default function(props: LineChartProperties) {
  const { data, yAxis, xAxis, lineStroke, gridStroke } = props;

  return (
    <LineChart
      width={600}
      height={300}
      data={data}
      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
    >
      <Line type="monotone" dataKey={yAxis} stroke={lineStroke} />
      <CartesianGrid stroke={gridStroke} strokeDasharray="5 5" />
      <XAxis dataKey={xAxis} />
      <YAxis dataKey={yAxis} />
      <Tooltip />
    </LineChart>
  );
}

type LineChartProperties = {
  data: any;
  xAxis: string;
  yAxis: string;
  lineStroke: string;
  gridStroke: string;
};
