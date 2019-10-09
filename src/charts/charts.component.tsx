import React, { useEffect } from "react";
import { Trans } from "react-i18next";

import resources from "./translations/index";
import { initI18n } from "../utils/translations";

import { CommonWidgetProps } from "../models/index";
import WidgetHeader from "../commons/widget-header/widget-header.component";

export default function Charts(props: ChartsProps) {
  initI18n(resources, props.language, useEffect);

  return (
    <div>
      <WidgetHeader title="Reports" icon="svg-icon icon-graph"></WidgetHeader>
      <h1>
        <Trans>Charts Widget</Trans>!!!
      </h1>
    </div>
  );
}

type ChartsProps = CommonWidgetProps & {};
