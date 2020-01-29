import React, { useEffect, useState } from "react";
import { openmrsFetch } from "@openmrs/esm-api";
import { Trans } from "react-i18next";

import { CommonWidgetProps, LoadingStatus } from "../models";
import WidgetHeader from "../commons/widget-header/widget-header.component";
import resources from "./translations";
import { initI18n } from "../utils/translations";

import globalStyles from "../global.css";
import styles from "./report-links.css";

export default function ReportLinks(props: ReportLinksProps) {
  const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.Loaded);
  const [reports, setReports] = useState(props.reports);

  initI18n(resources, props.locale, useEffect);

  const getKey = (name: string) => name.replace(/ /g, "-");
  const getCreateReportRequestBody = (uuid: string) => ({
    status: "REQUESTED",
    priority: "HIGHEST",
    reportDefinition: { parameterizable: { uuid: uuid } },
    renderingMode:
      "org.openmrs.module.reporting.web.renderers.DefaultWebRenderer"
  });

  const requestReport = (uuid: string) => {
    setLoadingStatus(LoadingStatus.Loading);

    const reportRequestUrl = `/ws/rest/v1/reportingrest/reportRequest`;
    const requestOptions = {
      method: "POST",
      body: getCreateReportRequestBody(uuid),
      headers: { "Content-Type": "application/json" }
    };

    const checkReportRequestStausAfterDelay = (uuid: string) => {
      setTimeout(() => checkIfReportRequestCompleted(uuid), 2000);
    };

    const checkIfReportRequestCompleted = (uuid: string) => {
      openmrsFetch(`${reportRequestUrl}/${uuid}`, { method: "GET" })
        .then(response => {
          response.data.status === "COMPLETED"
            ? updateReports(uuid, response.data.status)
            : checkReportRequestStausAfterDelay(uuid);
        })
        .catch(() => {
          checkReportRequestStausAfterDelay(uuid);
        });
    };

    openmrsFetch(reportRequestUrl, requestOptions)
      .then(response => {
        updateReports(response.data.uuid, "REQUESTED", uuid);
        checkReportRequestStausAfterDelay(response.data.uuid);
        setLoadingStatus(LoadingStatus.Loaded);
      })
      .catch(error => {
        setLoadingStatus(LoadingStatus.Failed);
        console.log(error); // eslint-disable-line
      });
  };

  const updateReports = (
    reportRequestUuid: string,
    status: string,
    reportUuid?: string
  ) => {
    const doesReportMatch = (reportLink: ReportLink) =>
      (reportUuid && reportLink.uuid === reportUuid) ||
      reportLink.request === reportRequestUuid;

    setReports(latestReports =>
      latestReports.map(report =>
        doesReportMatch(report)
          ? { ...report, request: reportRequestUuid, status }
          : report
      )
    );
  };

  const reportLinkActions = report => {
    const requestReportButton = () =>
      report.status === "REQUESTED" ? (
        <i title="Report Request Processing" className="spinner"></i>
      ) : (
        <button
          title="Request Report"
          onClick={() => requestReport(report.uuid)}
        >
          <i className="icon-play"></i>
        </button>
      );

    const showNoReportAvailableError = () =>
      props.showMessage({
        type: "error",
        message: (
          <span>
            No report available.
            <br /> Click{" "}
            <i className="icon-play" style={{ verticalAlign: "middle" }}></i> to
            request report.
          </span>
        )
      });

    const viewReportButton = () =>
      report.status === "COMPLETED" ? (
        <a
          href={`/openmrs/module/reporting/reports/viewReport.form?uuid=${report.request}`}
          target="new"
          title="View Report"
        >
          <i className={`${styles["icon-button"]} icon-file-alt`}></i>
        </a>
      ) : (
        <button
          title="Report not rendered yet"
          className={styles["disabled"]}
          onClick={showNoReportAvailableError}
        >
          <i className={`${styles["icon-button"]} icon-file-alt`}></i>
        </button>
      );

    return (
      <span className={styles["controls"]}>
        {requestReportButton()} {viewReportButton()}
      </span>
    );
  };

  const reportLinkElement = (reportLink: ReportLink) => (
    <div className={styles["report-link"]} key={getKey(reportLink.name)}>
      <span className={styles["report-name"]}>
        <i className={"icon-link"}></i>
        <span>
          <Trans>{reportLink.name}</Trans>
        </span>
      </span>
      {reportLinkActions(reportLink)}
    </div>
  );

  return (
    <>
      {loadingStatus === LoadingStatus.Loading && (
        <div className={globalStyles["loading-screen"]}>Fetching Data....</div>
      )}
      {loadingStatus === LoadingStatus.Failed && (
        <div className={globalStyles["loading-failed"]}>
          Error while fetching report data
        </div>
      )}
      <WidgetHeader
        title={props.title}
        totalCount={reports ? reports.length : 0}
        icon="svg-icon icon-todo"
      ></WidgetHeader>
      <div className={`${globalStyles["widget-content"]} widget-content`}>
        {reports.map(reportLinkElement)}
      </div>
    </>
  );
}

type ReportLinksProps = CommonWidgetProps & {
  reports: ReportLink[];
};

type ReportLink = {
  name: string;
  uuid: string;
  request?: string;
  status?: string;
};
