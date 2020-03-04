import React, { useEffect, useState } from "react";
import { Trans } from "react-i18next";

import { CommonWidgetProps, LoadingStatus } from "../models";
import WidgetHeader from "../commons/widget-header/widget-header.component";
import resources from "./translations";
import { initI18n } from "../utils/translations";
import ChartLoader from "../charts/chart-loader.component";
import TableLoader from "../tables/table-loader.component";

import globalStyles from "../global.css";
import styles from "./report-links.css";
import ReactModal from "react-modal";

ReactModal.defaultStyles.overlay.backgroundColor = "#ffffff90";
const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    height: "40%",
    maxWidth: "80%",
    maxHeight: "80%"
  }
};

export default function ReportLinks({
  locale,
  title,
  reports
}: ReportLinksProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentChart, setCurrentChart] = useState(null);
  const [currentTable, setCurrentTable] = useState(null);

  initI18n(resources, locale, useEffect);

  const getKey = (name: string) => name.replace(/ /g, "-");

  const renderReactModal = () => (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      style={modalStyles}
      ariaHideApp={false}
    >
      <div className={`${styles["report-link-container"]}`}>
        {currentChart && (
          <ChartLoader
            key={currentChart.name}
            config={currentChart}
            locale={locale}
          ></ChartLoader>
        )}
        {currentTable && (
          <TableLoader
            key={currentTable.name}
            config={currentTable}
            locale={locale}
          ></TableLoader>
        )}
        <button
          title="Close window"
          className={`${styles["close-button"]}`}
          onClick={() => setIsModalOpen(false)}
        >
          X
        </button>
      </div>
    </ReactModal>
  );

  const openReportInModal = report => {
    setIsModalOpen(true);
    if (report.type === "Chart") {
      modalStyles.content.width = "40%";
      modalStyles.content.height = "40%";
      setCurrentChart(report.properties);
      setCurrentTable(null);
    } else if (report.type === "Table") {
      modalStyles.content.width = "fit-content";
      modalStyles.content.height = "80%";
      setCurrentTable(report.properties);
      setCurrentChart(null);
    }
  };

  const reportLinkElement = report => (
    <div className={styles["report-link"]} key={getKey(report.name)}>
      <span className={styles["report-name"]}>
        <i className={"icon-link"}></i>
        <button title={report.name} onClick={() => openReportInModal(report)}>
          <Trans>{report.name}</Trans>
        </button>
      </span>
    </div>
  );

  return (
    <>
      <WidgetHeader
        title={title}
        totalCount={reports ? reports.length : 0}
        icon="svg-icon icon-external-link"
      ></WidgetHeader>
      <div className={`${globalStyles["widget-content"]} widget-content`}>
        {reports.map(reportLinkElement)}
      </div>
      {renderReactModal()}
    </>
  );
}

type ReportLinksProps = CommonWidgetProps & {
  reports: Array<Report>;
};

type Report = {
  name: string;
  properties: any;
  type: string;
};
