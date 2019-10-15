import React, { useEffect, useState } from "react";
import { openmrsFetch } from "@openmrs/esm-api";
import LineChart from "./types/line-chart.component";
import { LoadingStatus } from "../models";

export default function ChartLoader(props) {
  const [dataPoints, setDataPoints] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.Loading);
  const { config } = props;

  useEffect(() => {
    openmrsFetch(config.url)
      .then(response => {
        setDataPoints(
          mapRowsToChartDataPoints(getRows(config.dataFields, response.data))
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

  function getRows(str, req) {
    str.split(".").forEach(property => {
      if (req.length) {
        req = req[0];
      } else {
        req = req[property];
      }
    });

    return req;
  }

  function renderLoadingMessage() {
    return <span className="loading">Loading...</span>;
  }

  function renderErrorMessage() {
    return (
      <span className="error">Unable to load Chart {config.reportName}</span>
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
        return <div>Chart not found</div>;
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

  return (
    <div className="chart-container" style={{ width: "100%", height: "100%" }}>
      {displayChart()}
    </div>
  );
}
