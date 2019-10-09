import React, { useEffect } from "react";
import { Trans } from "react-i18next";

import resources from "./translations/index";
import { initI18n } from "../utils/translations";

import { CommonWidgetProps } from "../models/index";
import WidgetHeader from "../commons/widget-header/widget-header.component";

export default function Appointment(props: AppointmentProps) {
  initI18n(resources, props.language, useEffect);

  return (
    <div>
      <WidgetHeader
        title="Today's Appointments"
        icon="svg-icon icon-calender"
      ></WidgetHeader>
      <h1>
        <Trans>Appointment Widget</Trans>!!!
      </h1>
    </div>
  );
}

type AppointmentProps = CommonWidgetProps & {};
