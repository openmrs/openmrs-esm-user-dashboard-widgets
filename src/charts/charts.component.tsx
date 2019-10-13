import React from "react";
import ChartLoader from "./chart-loader.component";

export default function Charts(props) {
  return (
    <div>
      <h1>{props.title}</h1>
      {props.charts.map(config => {
        return <ChartLoader config={config} />;
      })}
    </div>
  );
}
