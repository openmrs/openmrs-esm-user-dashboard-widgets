import React from "react";
import ChartLoader from "./chart-loader.component";

export default function Charts(props: chartProps) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <h1>{props.title}</h1>
      {props.charts.map(config => {
        return <ChartLoader config={config} />;
      })}
    </div>
  );
}

type chartProps = {
  charts: Array<any>;
  title: string;
};
