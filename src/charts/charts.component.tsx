import React, { useEffect } from "react";

import resources from "./translations/index";
import { initI18n } from "../utils/translations";

import { CommonWidgetProps } from "../models/index";
import WidgetHeader from "../commons/widget-header/widget-header.component";
import ChartLoader from "./chart-loader.component";

import styles from "./charts.css";
import globalStyles from "../global.css";

export default function Charts({ locale, title, charts }: chartProps) {
  initI18n(resources, locale, useEffect);

  return (
    <div className={`${globalStyles["widget-container"]} charts`}>
      <WidgetHeader title={title} icon="svg-icon icon-graph"></WidgetHeader>
      <div className={`${styles["charts-container"]} widget-content`}>
        {charts.map(config => (
          <ChartLoader key={config.name} locale={locale} config={config} />
        ))}
      </div>
    </div>
  );
}

type chartProps = CommonWidgetProps & {
  charts: Array<any>;
  title: string;
};
