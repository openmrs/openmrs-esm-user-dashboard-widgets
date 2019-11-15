import React from "react";
import { Trans } from "react-i18next";

import styles from "./widget-header.css";

export default function WidgetHeader(props: WidgetHeaderProps) {
  const { title, icon, totalCount } = props;

  const totalCountComponent = count => (count ? <> ({count})</> : <></>);
  return (
    <div className={styles["widget-header"] + " widget-header"}>
      <i className={icon}></i>
      <span className={styles["title"]}>
        <Trans>{title}</Trans> {totalCountComponent(totalCount)}
      </span>
    </div>
  );
}

type WidgetHeaderProps = {
  title: string;
  icon?: string;
  totalCount?: number;
};
