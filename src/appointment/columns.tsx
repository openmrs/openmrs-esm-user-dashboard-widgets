import React from "react";
import { Trans } from "react-i18next";
import { openmrsFetch } from "@openmrs/esm-api";

import defaultAppointmentColumns from "./config.json";
import buildColumn from "../refapp-grid/column-builder";
import styles from "./appointment.css";
import { doesMatchConditions } from "../utils";

const checkInAppointmentUrl = (baseUrl: string, appointmentId: string) =>
  `${baseUrl}/${appointmentId}/status-change`;

const checkIn = (appointment, refreshAppointments, baseUrl: string) => {
  const handleCheckInResponse = response => {
    if (response.ok) {
      refreshAppointments();
    } else {
      response.json().then(err => console.log(err)); // eslint-disable-line no-console
    }
  };

  const checkInRequestData = {
    toStatus: "CheckedIn",
    onDate: new Date().toISOString()
  };

  const checkInRequestInit = {
    method: "POST",
    body: checkInRequestData,
    headers: {
      "Content-Type": "application/json"
    }
  };
  openmrsFetch(
    checkInAppointmentUrl(baseUrl, appointment.uuid),
    checkInRequestInit
  ).then(response => {
    handleCheckInResponse(response);
  });
};

const getActionColumns = (configs, baseUrl, refreshAppointments) => {
  if (!configs || configs.length <= 0) {
    return [];
  }

  const actionHandlers = {
    CheckIn: checkIn
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
        onClick={() => actionHandler(appointment, refreshAppointments, baseUrl)}
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
  actionConfigs
) {
  const defaultColumns = defaultAppointmentColumns.columns.map(columnConfig =>
    buildColumn(columnConfig)
  );

  return [
    ...defaultColumns,
    ...getActionColumns(actionConfigs, baseUrl, refreshAppointments)
  ];
}
