import React, { useEffect, useState } from "react";
import { openmrsFetch } from "@openmrs/esm-api";
import { Trans } from "react-i18next";

import resources from "./translations/index";
import { initI18n } from "../utils/translations";

import { LoadingStatus } from "../models";
import { charts as constants } from "../constants.json";
import { getField, compose } from "../utils/index";

import LineChart from "./types/line-chart.component";
import styles from "./charts.css";

export default function ChartLoader({ config, locale }) {
  initI18n(resources, locale, useEffect);

  const [dataPoints, setDataPoints] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.Loading);

  const getSource = responseData => getField(responseData, config.sourcePath);
  useEffect(() => {
    openmrsFetch(config.url)
      .then(({ data }) => {
        compose(setDataPoints, getSource)(data);
        setLoadingStatus(LoadingStatus.Loaded);
      })
      .catch(e => {
        //@ts-ignore
        console.log(e); // eslint-disable-line
        setLoadingStatus(LoadingStatus.Failed);
      });
  }, [config.url]);

  function renderLoadingMessage() {
    return (
      <span className="loading">
        <Trans>Loading</Trans>...
      </span>
    );
  }

  function renderErrorMessage() {
    return (
      <span className="error">
        <Trans>Unable to load Chart</Trans> {config.name}
      </span>
    );
  }

  function renderChart(chartType) {
    switch (chartType) {
      case "LineChart":
        return (
          <LineChart
            data={dataPoints}
            xAxis={config.xAxis}
            yAxis={config.yAxis}
            lineStrokeColor={config.lineStrokeColor || "#00463f"}
            gridStrokeColor={config.gridStrokeColor || "#ddd"}
          />
        );
      default:
        return (
          <div>
            <Trans>{constants.CHART_TYPE_NOT_FOUND_MESSAGE}</Trans>
          </div>
        );
    }
  }

  function displayChart() {
    switch (loadingStatus) {
      case LoadingStatus.Loaded:
        return renderChart(config.type);
      case LoadingStatus.Loading:
        return renderLoadingMessage();
      default:
        return renderErrorMessage();
    }
  }

  const fulfil = {
    width: "100%",
    height: "75%"
  };

  return (
    <>
      <div className={styles["chart-container"]}>
        <header>
          <Trans>{config.name}</Trans>
        </header>
        <div style={fulfil}>{displayChart()}</div>
      </div>
    </>
  );
}
