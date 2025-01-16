import React, { useEffect, useMemo, useState } from "react";
import { openmrsFetch } from "@openmrs/esm-api";
import { Trans } from "react-i18next";

import resources from "./translations/index";
import { initI18n } from "../utils/translations";

import { LoadingStatus } from "../models";
import { charts as constants } from "../constants.json";
import { getField, compose } from "../utils/index";

import LineChart from "./types/line-chart.component";
import styles from "./charts.css";
import { useSessionLocation } from "../utils/useSessionLocation";

export default function ChartLoader({ config, locale }) {
  initI18n(resources, locale, useEffect);

  const { locationUuid, error, isLoading } = useSessionLocation();
  const [dataPoints, setDataPoints] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.Loading);
  const [chartUrl, setChartUrl] = useState<string>();

  const getSource = responseData => getField(responseData, config.sourcePath);

  useMemo(() => {
    if (!isLoading) {
      if (config.locationProperty) {
        setChartUrl(`${config.url}?${config.locationProperty}=${locationUuid}`);
      } else {
        setChartUrl(config.url);
      }
    }
  }, [config.url, isLoading, locationUuid]);

  useEffect(() => {
    if (!chartUrl) return;
    openmrsFetch(chartUrl)
      .then(({ data }) => {
        compose(setDataPoints, getSource)(data);
        setLoadingStatus(LoadingStatus.Loaded);
      })
      .catch(e => {
        //@ts-ignore
        console.log(e); // eslint-disable-line
        setLoadingStatus(LoadingStatus.Failed);
      });
  }, [chartUrl]);

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
            lineStrokeColor={config.lineStrokeColor}
            gridStrokeColor={config.gridStrokeColor}
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
    if (loadingStatus == LoadingStatus.Loading || isLoading) {
      return renderLoadingMessage();
    } else if (loadingStatus == LoadingStatus.Loaded) {
      return renderChart(config.type);
    } else {
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
