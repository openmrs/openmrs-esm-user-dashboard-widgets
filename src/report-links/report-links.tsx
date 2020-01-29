import React, { useEffect } from "react";

import { CommonWidgetProps } from "../models";
import WidgetHeader from "../commons/widget-header/widget-header.component";
import globalStyles from "../global.css";
import styles from "./report-links.css";
import resources from "./translations";
import { initI18n } from "../utils/translations";
import { Trans } from "react-i18next";

export default function ReportLinks(props: ReportLinksProps) {
  const getKey = (name: string) => name.replace(/ /g, "-");

  initI18n(resources, props.locale, useEffect);

  const reportLinkElement = (reportLink: ReportLink) => (
    <div className={styles["report-link"]} key={getKey(reportLink.name)}>
      <i className={"icon-link"}></i>
      <a href={reportLink.link} target="_blank" title={reportLink.name}>
        <Trans>{reportLink.name}</Trans>
      </a>
    </div>
  );

  return (
    <>
      <WidgetHeader
        title={props.title}
        totalCount={props.reports ? props.reports.length : 0}
        icon="svg-icon icon-todo"
      ></WidgetHeader>
      <div className={`${globalStyles["widget-content"]} widget-content`}>
        {props.reports.map(reportLinkElement)}
      </div>
    </>
  );
}

type ReportLinksProps = CommonWidgetProps & {
  reports: ReportLink[];
};

type ReportLink = {
  name: string;
  link: string;
};
