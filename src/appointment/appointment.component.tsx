import React, { useEffect, useState } from "react";
import { useInterval } from "react-use";

import resources from "./translations";
import { initI18n } from "../utils/translations";

import { LoadingStatus } from "../models";
import { AppointmentProps } from "./appointment.model";
import WidgetHeader from "../commons/widget-header/widget-header.component";
import WidgetFooter from "../commons/widget-footer/widget-footer.component";
import RefAppGrid from "../refapp-grid/refapp-grid.component";
import getAppointmentColumns from "./columns";
import { getAppointments } from "./appointment.resource";

import { filterByConditions, compose } from "../utils";
import { appointments as constants } from "../constants.json";

import globalStyles from "../global.css";
import { Trans } from "react-i18next";

export default function Appointment(props: AppointmentProps) {
  const secondInMilliSeconds = 1000;
  const [appointments, setAppointments] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.Loading);
  const [currentRefreshInterval, setCurrentRefreshInterval] = useState(null);
  const {
    showMessage,
    source,
    title,
    viewAll = "",
    viewAllWindow,
    refreshInterval = 0,
    provider = "",
    locale
  } = props;

  initI18n(resources, locale, useEffect);

  useInterval(() => fetchAppointments(), currentRefreshInterval);

  const getRefreshInterval = () =>
    refreshInterval > 0 ? refreshInterval : constants.DEFAULT_REFRESH_INTERVAL;
  const disableRefreshAppointmentsTimer = () => setCurrentRefreshInterval(null);
  const enableRefreshAppointmentsTimer = () =>
    setCurrentRefreshInterval(secondInMilliSeconds * getRefreshInterval());

  const fetchAppointments = () => {
    disableRefreshAppointmentsTimer();
    getAppointments(source, provider)
      .then(response => {
        compose(
          () => setLoadingStatus(LoadingStatus.Loaded),
          enableRefreshAppointmentsTimer,
          setAppointments,
          filterAppointments,
          sortAppointments
        )(response.data);
      })
      .catch(error => {
        setLoadingStatus(LoadingStatus.Failed);
        console.log(error); // eslint-disable-line
      });
  };

  const sortAppointments = appointments => {
    const compareAppointments = (current, next) =>
      current[constants.SORT_BY] - next[constants.SORT_BY];
    appointments.sort(compareAppointments);
    return appointments;
  };

  const filterAppointments = appointments => {
    const filteredAppointments = source.filters
      ? filterByConditions(appointments, source.filters)
      : appointments;
    return filterByProviderResponse(filteredAppointments);
  };

  const filterByProviderResponse = appointments => {
    // Todo: Needs to be refactored to a better approach.
    return source.providerStatusFilterType == "self"
      ? appointments.filter(appointment => {
          return appointment.providers.filter(
            appointmentProvider =>
              appointmentProvider.uuid == provider &&
              appointmentProvider.response == "AWAITING"
          ).length;
        })
      : appointments;
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

  const showGrid = () => (
    <div className={`${globalStyles["widget-content"]} widget-content`}>
      <RefAppGrid
        data={appointments}
        columns={getAppointmentColumns(
          source.url,
          fetchAppointments,
          props.actions,
          showMessage,
          provider,
          source
        )}
        noDataText="No appointments"
      ></RefAppGrid>
    </div>
  );

  const showWidget = () => {
    return (
      <div className={`${globalStyles["widget-container"]} appointment`}>
        <WidgetHeader
          title={title}
          icon="svg-icon icon-calender"
          totalCount={appointments ? appointments.length : 0}
        ></WidgetHeader>
        {loadingStatus === LoadingStatus.Loaded ? showGrid() : showError()}
        <WidgetFooter
          viewAllUrl={viewAll}
          viewAllWindow={viewAllWindow}
          context={{
            locale,
            showMessage,
            provider
          }}
        ></WidgetFooter>
      </div>
    );
  };

  return loadingStatus === LoadingStatus.Loading ? showLoading() : showWidget();
}
