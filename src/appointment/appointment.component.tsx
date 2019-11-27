import React, { useEffect, useState } from "react";
import { openmrsFetch } from "@openmrs/esm-api";
import { useInterval } from "react-use";
import subMinutes from "date-fns/subMinutes";

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
    title,
    viewAll = "",
    refreshInterval = 0
  } = props;

  const fetchAppointmentsUrl = () => replaceParams(`${source.url}/search`);

  useInterval(() => fetchAppointments(), currentRefreshInterval);

  const getRefreshInterval = () =>
    refreshInterval > 0 ? refreshInterval : constants.DEFAULT_REFRESH_INTERVAL;
  const disableRefreshAppointmentsTimer = () => setCurrentRefreshInterval(null);
  const enableRefreshAppointmentsTimer = () =>
    setCurrentRefreshInterval(secondInMilliSeconds * getRefreshInterval());

  const requestBody = () => {
    const body = {
      startDate: new Date(
        subMinutes(
          new Date(),
          source.fromTimeDelayInMinutes ? source.fromTimeDelayInMinutes : 0
        )
      ).toISOString(),
      endDate: new Date(new Date().setUTCHours(23, 59, 59, 9)).toISOString()
    };

    return {
      ...body,
      ...(source.fetchType === "self"
        ? { providerUuid: "a1206f9f-7b59-46fb-ad6a-b00ca7e781c1" }
        : {})
    };
  };

  const fetchAppointments = () => {
    disableRefreshAppointmentsTimer();
    openmrsFetch(fetchAppointmentsUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: requestBody()
    })
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
      current[constants.SORT_BY] - next[constants.SORT_BY];
    fetchedAppointments.sort(compareAppointments);

    return source.filters
      ? filterByConditions(fetchedAppointments, source.filters)
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
          totalCount={appointments.length}
        ></WidgetHeader>
        <div className={globalStyles["widget-content"]}>
          <RefAppGrid
            data={appointments}
            columns={getAppointmentColumns(
              props.source.url,
              fetchAppointments,
              props.actions,
              showMessage
            )}
            noDataText="No appointments"
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
  source: AppointmentSource;
  refreshInterval?: number;
  viewAll?: string;
  actions?: WidgetAction[];
};

type WidgetAction = {
  name: string;
  when: Condition[];
};

type AppointmentSource = {
  url: string;
  fetchType?: string;
  fromTimeDelayInMinutes?: number;
  filters?: Condition[];
};
