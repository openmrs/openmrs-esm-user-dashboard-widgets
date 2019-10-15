import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function(props: LineChartProperties) {
  const { data, yAxis, xAxis, lineStroke, gridStroke } = props;

  return (
    <ResponsiveContainer>
      <LineChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
        <Line type="monotone" dataKey={yAxis} stroke={lineStroke} />
        <CartesianGrid stroke={gridStroke} strokeDasharray="5 5" />
        <XAxis dataKey={xAxis} />
        <YAxis dataKey={yAxis} />
        <Tooltip />
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
