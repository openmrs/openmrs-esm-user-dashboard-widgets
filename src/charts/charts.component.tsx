import React, { useEffect } from "react";

import resources from "./translations/index";
import { initI18n } from "../utils/translations";

import { CommonWidgetProps } from "../models/index";
import WidgetHeader from "../commons/widget-header/widget-header.component";
import ChartLoader from "./chart-loader.component";
import styles from "./charts.css";

export default function Charts({ locale, title, charts }: chartProps) {
  initI18n(resources, locale, useEffect);

  return (
    <>
      <WidgetHeader title={title} icon="svg-icon icon-graph"></WidgetHeader>
      <div className={styles["charts-container"]}>
        {charts.map(config => (
          <ChartLoader key={config.name} config={config} />
        ))}
      </div>
    </>
  );
}

type chartProps = CommonWidgetProps & {
  charts: Array<any>;
  title: string;
};
