import React from "react";
import { Trans } from "react-i18next";

import styles from "./widget-header.css";

export default function WidgetHeader(props: WidgetHeaderProps) {
  const { title, icon } = props;
  return (
    <div className={styles["widget-header"]}>
      <i className={icon}></i>
      <span className={styles["title"]}>
        <Trans>{title}</Trans>
      </span>
    </div>
  );
}

type WidgetHeaderProps = {
  title: string;
  icon?: string;
};
