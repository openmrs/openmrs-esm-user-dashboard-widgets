import React from "react";
import { Trans } from "react-i18next";

import styles from "./widget-footer.css";

export default function WidgetFooter(props: WidgetFooterProps) {
  const { viewAllUrl } = props;
  return (
    <div className={styles["widget-footer"] + " widget-footer"}>
      {viewAllUrl && (
        <a href={viewAllUrl}>
          <button className={styles["view-all"]}>
            <Trans>View All</Trans>
          </button>
        </a>
      )}
    </div>
  );
}

type WidgetFooterProps = {
  viewAllUrl?: string;
};
