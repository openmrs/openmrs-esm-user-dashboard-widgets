import React, { useEffect, useState } from "react";
import { openmrsFetch } from "@openmrs/esm-api";
import { useInterval } from "react-use";

import resources from "./translations";
import { initI18n } from "../utils/translations";

import { CommonWidgetProps, Condition, LoadingStatus } from "../models";
import WidgetHeader from "../commons/widget-header/widget-header.component";
import WidgetFooter from "../commons/widget-footer/widget-footer.component";
import RefAppGrid from "../refapp-grid/refapp-grid.component";
import getAppointmentColumns from "./columns";

import { filterByConditions, compose } from "../utils";
import replaceParams from "../utils/param-replacers";
import { appointments as constants } from "../constants.json";

import globalStyles from "../global.css";
import { Trans } from "react-i18next";

export default function Appointment(props: AppointmentProps) {
  initI18n(resources, props.locale, useEffect);
  const secondInMilliSeconds = 1000;
  const [appointments, setAppointments] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.Loading);
  const [currentRefreshInterval, setCurrentRefreshInterval] = useState(null);
  const {
    showMessage,
    source,
    filters,
    title,
    viewAll = "",
    refreshInterval = 0
  } = props;

  const fetchAppointmentsUrl = () =>
    replaceParams(`${source}/${constants.fetchUrl}`);

  useInterval(() => fetchAppointments(), currentRefreshInterval);

  const getRefreshInterval = () =>
    refreshInterval > 0 ? refreshInterval : constants.defaultRefreshInterval;
  const disableRefreshAppointmentsTimer = () => setCurrentRefreshInterval(null);
  const enableRefreshAppointmentsTimer = () =>
    setCurrentRefreshInterval(secondInMilliSeconds * getRefreshInterval());

  const fetchAppointments = () => {
    disableRefreshAppointmentsTimer();
    openmrsFetch(fetchAppointmentsUrl())
      .then(response => {
        compose(
          enableRefreshAppointmentsTimer,
          setAppointments,
          formatAppointments
        )(response.data);
        setLoadingStatus(LoadingStatus.Loaded);
      })
      .catch(error => {
        setLoadingStatus(LoadingStatus.Failed);
        console.log(error); // eslint-disable-line
      });
  };

  const formatAppointments = fetchedAppointments => {
    const compareAppointments = (current, next) =>
      current[constants.sortBy] - next[constants.sortBy];
    fetchedAppointments.sort(compareAppointments);

    return filters
      ? filterByConditions(fetchedAppointments, filters)
      : fetchedAppointments;
  };

  useEffect(() => fetchAppointments(), []);

  const showLoading = () => (
    <div>
      <Trans>Loading</Trans>...
    </div>
  );

  const showError = () => (
    <div className="error">
      <Trans>Unable to load appointments</Trans>
    </div>
  );

  const showGrid = () => {
    return (
      <div className={globalStyles["widget-container"]}>
        <WidgetHeader
          title={title}
          icon="svg-icon icon-calender"
        ></WidgetHeader>
        <div className={globalStyles["widget-content"]}>
          <RefAppGrid
            data={appointments}
            columns={getAppointmentColumns(
              props.source,
              fetchAppointments,
              props.actions,
              showMessage
            )}
            noDataText="No appointments found"
          ></RefAppGrid>
        </div>
        <WidgetFooter viewAllUrl={viewAll}></WidgetFooter>
      </div>
    );
  };

  switch (loadingStatus) {
    case LoadingStatus.Loaded:
      return showGrid();
    case LoadingStatus.Failed:
      return showError();
    default:
      return showLoading();
  }
}

type AppointmentProps = CommonWidgetProps & {
  source: string;
  refreshInterval?: number;
  viewAll?: string;
  filters?: Condition[];
  actions?: WidgetAction[];
};

type WidgetAction = {
  name: string;
  when: Condition[];
};
