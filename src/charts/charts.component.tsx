import React from "react";

import WidgetHeader from "../commons/widget-header/widget-header.component";
import ChartLoader from "./chart-loader.component";

export default function Charts(props: chartProps) {
  const chartContainer = {
    width: "100%",
    height: "100%"
  };
  return (
    <>
      <WidgetHeader
        title={props.title}
        icon="svg-icon icon-graph"
      ></WidgetHeader>
      <div style={chartContainer}>
        {props.charts.map(config => {
          return <ChartLoader config={config} />;
        })}
      </div>
    </>
  );
}

type chartProps = {
  charts: Array<any>;
  title: string;
};
