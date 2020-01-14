import React from "react";

import { CommonWidgetProps } from "../models";
import WidgetHeader from "../commons/widget-header/widget-header.component";

export default function ReportLinks(props: ReportLinksProps) {
  const getKey = (name: string) => name.replace(/ /g, "-");
  const reportLinkElement = (reportLink: ReportLink) => (
    <div key={getKey(reportLink.name)}>
      <a href={reportLink.link} target="_blank" title={reportLink.name}>
        {reportLink.name}
      </a>
    </div>
  );

  return (
    <>
      <WidgetHeader
        title={props.title}
        icon="svg-icon icon-todo"
      ></WidgetHeader>
      {props.reports.map(reportLinkElement)}
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
