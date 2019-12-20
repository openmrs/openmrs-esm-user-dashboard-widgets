import React from "react";
import { Trans } from "react-i18next";

import defaultAppointmentColumns from "./config";
import buildColumn from "../refapp-grid/column-builder";
import styles from "./appointment.css";
import { addTestId, doesMatchConditions } from "../utils";
import { appointments as constants } from "../constants.json";
import {
  changeAppointmentProviderResponse,
  changeAppointmentStatus
} from "./appointment.resource";

const changeStatus = (
  appointmentUuid: string,
  status: string,
  refreshAppointments,
  baseUrl: string,
  showMessage,
  successMessage,
  errorMessage
) => {
  const handleResponse = response => {
    if (response.ok) {
      showMessage({
        type: "success",
        message: <Trans>{successMessage}</Trans>
      });
      refreshAppointments();
    } else {
      response.json().then(err => {
        showMessage({
          type: "error",
          message: <Trans>{errorMessage}</Trans>
        });
        console.log(err); // eslint-disable-line no-console
      });
    }
  };

  changeAppointmentStatus(appointmentUuid, status, baseUrl).then(
    handleResponse
  );
};

const changeProviderStatus = (
  appointmentUuid: string,
  providerStatus: string,
  refreshAppointments,
  baseUrl: string,
  showMessage,
  successMessage,
  errorMessage,
  provider
) => {
  const handleResponse = response => {
    if (response.ok) {
      showMessage({
        type: "success",
        message: <Trans>{successMessage}</Trans>
      });
      refreshAppointments();
    } else {
      response.json().then(err => {
        showMessage({
          type: "error",
          message: <Trans>{errorMessage}</Trans>
        });
        console.log(err); // eslint-disable-line no-console
      });
    }
  };
  changeAppointmentProviderResponse(
    appointmentUuid,
    providerStatus,
    provider,
    baseUrl
  )
    .then(handleResponse)
    .catch(err => {
      //Todo: Handled exception raised due to API Response with 200 & no response content. This needs to be removed once respective API is fixed.
      if (err.message == "Unexpected end of JSON input") {
        handleResponse({ ok: 200 });
      } else handleResponse({});
    });
};

const checkIn = (
  appointment,
  refreshAppointments,
  baseUrl: string,
  showMessage
) =>
  changeStatus(
    appointment.uuid,
    "CheckedIn",
    refreshAppointments,
    baseUrl,
    showMessage,
    constants.CHECK_IN_SUCCESS_MESSAGE,
    constants.CHECK_IN_ERROR_MESSAGE
  );

const markAsDone = (
  appointment,
  refreshAppointments,
  baseUrl: string,
  showMessage
) =>
  changeStatus(
    appointment.uuid,
    "Completed",
    refreshAppointments,
    baseUrl,
    showMessage,
    constants.COMPLETED_SUCCESS_MESSAGE,
    constants.COMPLETED_ERROR_MESSAGE
  );

const acceptAction = (
  appointment,
  refreshAppointments,
  baseUrl: string,
  showMessage,
  provider: string
) =>
  changeProviderStatus(
    appointment.uuid,
    "ACCEPTED",
    refreshAppointments,
    baseUrl,
    showMessage,
    constants.ACCEPTED_SUCCESS_RESPONSE,
    constants.ACCEPTED_ERROR_RESPONSE,
    provider
  );

const editAction = appointment =>
  window.open(
    `../owa/appointments/index.html#/home/manage/appointments/calendar/${appointment.uuid}`,
    "_blank"
  );

const getActionColumns = (
  configs,
  baseUrl,
  refreshAppointments,
  showMessage,
  provider
) => {
  if (!configs || configs.length <= 0) {
    return [];
  }

  const actionHandlers = {
    CheckIn: checkIn,
    Done: markAsDone,
    Edit: editAction,
    Accept: acceptAction
  };
  const iconLabel = label => (
    <div className={styles["icon-label"]}>
      <i className="small icon-ok text-color"></i>
      <Trans>{label}</Trans>
    </div>
  );

  const actionButton = (action, appointment) => {
    const actionHandler = actionHandlers[action.name];
    return (
      <button
        onClick={() =>
          actionHandler(
            appointment,
            refreshAppointments,
            baseUrl,
            showMessage,
            provider
          )
        }
        className="task button small-button"
      >
        <Trans>{action.name}</Trans>
      </button>
    );
  };

  const getActionColumn = action => {
    return appointment =>
      doesMatchConditions(appointment, action.when)
        ? actionButton(action, appointment)
        : iconLabel(appointment.status);
  };

  const actionColumns = configs.map(config => {
    return {
      id: `${config.name}_action`,
      style: { alignSelf: "center" },
      accessor: getActionColumn(config)
    };
  });

  return actionColumns;
};

export default function getColumns(
  baseUrl: string,
  refreshAppointments,
  actionConfigs,
  showMessage,
  provider,
  source
) {
  const defaultColumns = defaultAppointmentColumns.columns.map(columnConfig =>
    buildColumn(columnConfig, source)
  );

  const columns = [
    ...defaultColumns,
    ...getActionColumns(
      actionConfigs,
      baseUrl,
      refreshAppointments,
      showMessage,
      provider
    )
  ];

  return addTestId(columns);
}
