import React, { useEffect, useState } from "react";
import { Trans } from "react-i18next";

import { CommonWidgetProps, LoadingStatus } from "../models";
import WidgetHeader from "../commons/widget-header/widget-header.component";
import resources from "./translations";
import { initI18n } from "../utils/translations";
import ChartLoader from "../chartCommon/chart-loader.component";

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

export default function ReportLinks(props: ReportLinksProps) {
  const [charts, setCharts] = useState(props.charts);
  const [modalIsOpen, setIsOpen] = React.useState(false);

  initI18n(resources, props.locale, useEffect);

  const getKey = (name: string) => name.replace(/ /g, "-");
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const renderReactModal = chartConfig => (
    <ReactModal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      ariaHideApp={false}
    >
      <div className={`${styles["charts-container"]}`}>
        <ChartLoader
          key={chartConfig.name}
          locale={props.locale}
          config={chartConfig}
        />
      </div>
    </ReactModal>
  );

  const reportLinkElement = chartConfig => (
    <div className={styles["report-link"]} key={getKey(chartConfig.name)}>
      <span className={styles["report-name"]}>
        <i className={"icon-link"}></i>
        {renderReactModal(chartConfig)}
        <button onClick={openModal}>
          <Trans>{chartConfig.name}</Trans>
        </button>
      </span>
    </div>
  );

  return (
    <>
      <WidgetHeader
        title={props.title}
        totalCount={charts ? charts.length : 0}
        icon="svg-icon icon-external-link"
      ></WidgetHeader>
      <div className={`${globalStyles["widget-content"]} widget-content`}>
        {charts.map(reportLinkElement)}
      </div>
    </>
  );
}

type ReportLinksProps = CommonWidgetProps & {
  charts: Array<any>;
};
