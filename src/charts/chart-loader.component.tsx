import React, { useEffect, useState } from "react";
import { openmrsFetch } from "@openmrs/esm-api";
import LineChart from "./types/line-chart.component";
import { LoadingStatus } from "../models";
import { charts as constants } from "../constants.json";
import { getField } from "../utils/index";
import { Trans } from "react-i18next";

export default function ChartLoader(props) {
  const [dataPoints, setDataPoints] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.Loading);
  const { config } = props;

  useEffect(() => {
    openmrsFetch(config.url)
      .then(response => {
        setDataPoints(
          mapRowsToChartDataPoints(getField(response.data, config.sourcePath))
        );
        setLoadingStatus(LoadingStatus.Loaded);
      })
      .catch(e => {
        setDataPoints([...dataPoints]);
        setLoadingStatus(LoadingStatus.Failed);
      });
  }, []);

  function mapRowsToChartDataPoints(rows) {
    return rows.map(row => {
      return {
        [config.xAxis]: row[config.xAxis],
        [config.yAxis]: row[config.yAxis]
      };
    });
  }

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
            lineStroke={config.lineStroke || "#8884d8"}
            gridStroke={config.gridStroke || "#ccc"}
          />
        );
      default:
        return <div>{constants.NOT_FOUND_MESSAGE}</div>;
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
    height: "100%"
  };

  return (
    <div className="chart-container" style={fulfil}>
      {displayChart()}
    </div>
  );
}
