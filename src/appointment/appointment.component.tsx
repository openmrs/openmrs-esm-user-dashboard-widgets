import React, { useEffect, useState } from "react";
import { openmrsFetch } from "@openmrs/esm-api";

import resources from "./translations";
import { filterByConditions } from "../utils";
import { initI18n } from "../utils/translations";
import replaceParams from "../utils/param-replacers";
import { CommonWidgetProps, Condition } from "../models";
import WidgetHeader from "../commons/widget-header/widget-header.component";
import RefAppGrid from "../refapp-grid/refapp-grid.component";
import getAppointmentColumns from "./columns";

export default function Appointment(props: AppointmentProps) {
  initI18n(resources, props.locale, useEffect);
  const [appointments, setAppointments] = useState(null);
  const { showMessage, source, filters, title } = props;

  const fetchAppointmentsUrl = () =>
    replaceParams(`${source}/all/?forDate=%Today%`);

  const fetchAppointments = () => {
    openmrsFetch(fetchAppointmentsUrl()).then(response => {
      assignAppointments(response.data);
    });
  };

  const assignAppointments = fetchedAppointments => {
    setAppointments(
      filters
        ? filterByConditions(fetchedAppointments, filters)
        : fetchedAppointments
    );
  };

  useEffect(() => fetchAppointments(), []);

  const showLoading = () => <div>Loading...</div>;

  const showGrid = () => {
    return (
      <div>
        <WidgetHeader
          title={title}
          icon="svg-icon icon-calender"
        ></WidgetHeader>
        <RefAppGrid
          data={appointments}
          columns={getAppointmentColumns(
            props.source,
            fetchAppointments,
            props.actions,
            showMessage
          )}
        ></RefAppGrid>
      </div>
    );
  };

  return appointments ? showGrid() : showLoading();
}

type AppointmentProps = CommonWidgetProps & {
  source: string;
  filters?: Condition[];
  actions?: WidgetAction[];
};

type WidgetAction = {
  name: string;
  when: Condition[];
};
