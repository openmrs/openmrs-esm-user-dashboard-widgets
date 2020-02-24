import React, { useEffect, useState } from "react";
import { Trans } from "react-i18next";

import { CommonWidgetProps, LoadingStatus } from "../models";
import WidgetHeader from "../commons/widget-header/widget-header.component";
import resources from "./translations";
import { initI18n } from "../utils/translations";
import ChartLoader from "../charts/chart-loader.component";

import globalStyles from "../global.css";
import styles from "./report-links.css";
import ReactModal from "react-modal";

ReactModal.defaultStyles.overlay.backgroundColor = "#ffffff00";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "300px",
    width: "500px"
  }
};

export default function ReportLinks({
  locale,
  title,
  charts
}: ReportLinksProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentChart, setCurrentChart] = useState(null);

  initI18n(resources, locale, useEffect);

  const getKey = (name: string) => name.replace(/ /g, "-");

  const renderReactModal = () => (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      style={customStyles}
      ariaHideApp={false}
    >
      <div className={`${styles["charts-container"]}`}>
        {currentChart && (
          <ChartLoader config={currentChart} locale={locale}></ChartLoader>
        )}
      </div>
    </ReactModal>
  );

  const openChartInModal = chartConfig => {
    setIsModalOpen(true);
    setCurrentChart(chartConfig);
  };

  const reportLinkElement = chartConfig => (
    <div className={styles["report-link"]} key={getKey(chartConfig.name)}>
      <span className={styles["report-name"]}>
        <i className={"icon-link"}></i>
        <button onClick={() => openChartInModal(chartConfig)}>
          <Trans>{chartConfig.name}</Trans>
        </button>
      </span>
    </div>
  );

  return (
    <>
      <WidgetHeader
        title={title}
        totalCount={charts ? charts.length : 0}
        icon="svg-icon icon-external-link"
      ></WidgetHeader>
      <div className={`${globalStyles["widget-content"]} widget-content`}>
        {charts.map(reportLinkElement)}
      </div>
      {renderReactModal()}
    </>
  );
}

type ReportLinksProps = CommonWidgetProps & {
  charts: Array<any>;
};
