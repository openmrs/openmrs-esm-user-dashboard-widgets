import React from "react";
import { Trans } from "react-i18next";

import styles from "./widget-footer.css";
import { CommonWidgetProps } from "../../models";
import replaceParams from "../../utils/param-replacers";

export default function WidgetFooter(props: WidgetFooterProps) {
  const { viewAllUrl, viewAllWindow = "same" } = props;

  const getViewAllProperties = () => {
    const linkTargetProperty = windowMode =>
      windowMode === "same" ? {} : { target: "blank" };

    return {
      href: replaceParams(viewAllUrl, props.context),
      ...linkTargetProperty(viewAllWindow)
    };
  };

  return (
    <div className={styles["widget-footer"] + " widget-footer"}>
      {viewAllUrl && (
        <a {...getViewAllProperties()}>
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
  viewAllWindow?: string;
  context?: CommonWidgetProps;
};
