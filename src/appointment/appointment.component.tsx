import React, { useEffect, useState } from "react";
import { openmrsFetch } from "@openmrs/esm-api";

import resources from "./translations/index";
import { initI18n } from "../utils/translations";

import { CommonWidgetProps } from "../models/index";
import WidgetHeader from "../commons/widget-header/widget-header.component";
import RefAppGrid from "../refapp-grid/refapp-grid.component";
import configs from "./config.json";

export default function Appointment(props: AppointmentProps) {
  initI18n(resources, props.language, useEffect);
  const [appointments, setAppointments] = useState(null);

  useEffect(() => {
    openmrsFetch(props.sourceApi).then(response => {
      setAppointments(response.data);
    });
  }, []);

  const showLoading = () => <div>Loading...</div>;

  const showGrid = () => {
    return (
      <div>
        <WidgetHeader
          title={props.title}
          icon="svg-icon icon-calender"
        ></WidgetHeader>
        <RefAppGrid data={appointments} columns={configs.columns}></RefAppGrid>
      </div>
    );
  };

  return appointments ? showGrid() : showLoading();
}

type AppointmentProps = CommonWidgetProps & {
  sourceApi: string;
};
