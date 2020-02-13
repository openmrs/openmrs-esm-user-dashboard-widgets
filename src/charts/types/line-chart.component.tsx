import React from "react";
import { Trans } from "react-i18next";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import styles from "../charts.css";

export default function(props: LineChartProperties) {
  const DEFAULT_LINE_STROKE_COLOR = "#00463f";
  const DEFAULT_GRID_STROKE_COLOR = "#ddd";
  const {
    data,
    yAxis,
    xAxis,
    lineStrokeColor = DEFAULT_LINE_STROKE_COLOR,
    gridStrokeColor = DEFAULT_GRID_STROKE_COLOR
  } = props;

  const renderLegend = props => {
    const { payload } = props;
    return (
      <ul>
        {payload.map((entry, index) => (
          <span key={entry.value} className={styles["legend-container"]}>
            <LegendIcon color={entry.color} />
            <span className={styles["legend-text"]} key={`item-${index}`}>
              <Trans>{entry.value}</Trans>
            </span>
          </span>
        ))}
      </ul>
    );
  };

  function getChartLines(axisConfig) {
    if (typeof axisConfig === "string") {
      return (
        <Line type="monotone" dataKey={axisConfig} stroke={lineStrokeColor} />
      );
    }

    return axisConfig.map(yAxisConfig => {
      return (
        <Line
          type="monotone"
          dataKey={yAxisConfig.field}
          stroke={yAxisConfig.color}
        />
      );
    });
  }

  return (
    <ResponsiveContainer>
      <LineChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
        {getChartLines(yAxis)}
        <CartesianGrid stroke={gridStrokeColor} strokeDasharray="5 5" />
        <XAxis dataKey={xAxis} tick={{ fill: "#00463f", fontSize: "10px" }} />
        <YAxis />
        <Tooltip />
        <Legend content={renderLegend} iconType={"line"} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function LegendIcon(props: LegendIconProperties) {
  const { color } = props;

  return (
    <svg
      className="recharts-surface"
      width="14"
      height="14"
      viewBox="0 0 32 32"
      version="1.1"
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        marginRight: "4px"
      }}
    >
      <path
        strokeWidth="4"
        fill="none"
        stroke={color}
        d="M0,16h10.666666666666666
  A5.333333333333333,5.333333333333333,0,1,1,21.333333333333332,16
  H32M21.333333333333332,16
  A5.333333333333333,5.333333333333333,0,1,1,10.666666666666666,16"
        className="recharts-legend-icon"
      ></path>
    </svg>
  );
}

type LineChartProperties = {
  data: any;
  xAxis: string;
  yAxis: string | AxisConfig[];
  gridStrokeColor: string;
  lineStrokeColor: string;
};

type AxisConfig = {
  field: string;
  color: string;
};

type LegendIconProperties = {
  color: string;
};
