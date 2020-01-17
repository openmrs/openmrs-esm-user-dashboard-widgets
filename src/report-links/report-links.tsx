import React from "react";

import { CommonWidgetProps } from "../models";
import WidgetHeader from "../commons/widget-header/widget-header.component";

export default function ReportLinks(props: ReportLinksProps) {
  const getKey = (name: string) => name.replace(/ /g, "-");

  const divstyle = {
    padding: "10px",
    "text-align": "left",
    overflow: "scroll"
  };

  const rowStyle = {
    borderBottomColor: "blue",
    borderBottomWidth: 1
  };

  const tableStyle = {
    border: "none",
    boxShadow: "none",
    "border-spacing": "0px"
  };
  const reportLinkElement = (reportLink: ReportLink) => (
    <tr style={rowStyle}>
      <td>
        <i className={"icon-record"}></i>
      </td>
      <td key={getKey(reportLink.name)}>
        <a href={reportLink.link} target="_blank" title={reportLink.name}>
          {reportLink.name}
        </a>
      </td>
    </tr>
  );

  return (
    <>
      <WidgetHeader
        title={props.title}
        totalCount={props.reports ? props.reports.length : 0}
        icon="svg-icon icon-todo"
      ></WidgetHeader>
      <div style={divstyle}>
        <table style={tableStyle}>{props.reports.map(reportLinkElement)}</table>
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
