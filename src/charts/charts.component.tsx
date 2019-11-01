import React, { useEffect } from "react";

import resources from "./translations/index";
import { initI18n } from "../utils/translations";

import { CommonWidgetProps } from "../models/index";
import WidgetHeader from "../commons/widget-header/widget-header.component";
import ChartLoader from "./chart-loader.component";

export default function Charts(props: chartProps) {
  initI18n(resources, props.locale, useEffect);
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
          return <ChartLoader key={config.name} config={config} />;
        })}
      </div>
    </>
  );
}

type chartProps = CommonWidgetProps & {
  charts: Array<any>;
  title: string;
};
