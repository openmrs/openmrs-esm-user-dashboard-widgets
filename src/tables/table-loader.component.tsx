import React, { useEffect, useState } from "react";
import { openmrsFetch } from "@openmrs/esm-api";
import { Trans } from "react-i18next";
import ReactTable from "react-table";

import resources from "./translations/index";
import { initI18n } from "../utils/translations";

import { LoadingStatus } from "../models";
import { getField, compose } from "../utils/index";
import getColumns from "./columns";

import styles from "./tables.css";
import RefAppGrid from "../refapp-grid/refapp-grid.component";

export default function TableLoader({ config, locale }) {
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
        <Trans>Unable to load table</Trans> {config.name}
      </span>
    );
  }

  function renderTable() {
    return (
      <RefAppGrid
        data={dataPoints}
        showHeader={true}
        columns={getColumns(config)}
        noDataText="No Table Data"
      ></RefAppGrid>
    );
  }

  function displayTable() {
    switch (loadingStatus) {
      case LoadingStatus.Loaded:
        return renderTable();
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
      <div className={styles["table-container"]}>
        <header>
          <Trans>{config.name}</Trans>
        </header>
        <div style={fulfil}>{displayTable()}</div>
      </div>
    </>
  );
}
