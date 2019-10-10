import React, { useEffect, useState } from "react";
import ReactTable from "react-table";
import { openmrsFetch } from "@openmrs/esm-api";

import "react-table/react-table.css";

import resources from "./translations/index";
import { initI18n } from "../utils/translations";

import { CommonWidgetProps } from "../models/index";
import WidgetHeader from "../commons/widget-header/widget-header.component";
import styles from "./appointment.css";

export default function Appointment(props: AppointmentProps) {
  initI18n(resources, props.language, useEffect);
  const [appointments, setAppointments] = useState(null);

  useEffect(() => {
    openmrsFetch("/frontend/mocks/appointments.json").then(response => {
      setAppointments(response.data);
    });
  }, []);

  const getAsParimaryCell = (primaryValue, secondaryValue) => {
    return (
      <div>
        <div className={styles["primary-data"]}>{primaryValue}</div>
        <div className={styles["secondary-data"]}>{secondaryValue}</div>
      </div>
    );
  };
  const getAsDataCell = (value, secondaryValue) => {
    return (
      <div>
        <div className={styles["data"]}>{value}</div>
        <div className={styles["secondary-data"]}>{secondaryValue}</div>
      </div>
    );
  };
  const getAsColorCell = (value, color) => {
    const circleColor = {
      background: color
    };
    return (
      <div className={styles["color-cell"]}>
        <div className={styles["circle"]} style={circleColor} />
        <div className={styles["secondary-data"]}>{value}</div>
      </div>
    );
  };
  const getActionButton = (text, action) => {
    return (
      <input
        className={"task button small"}
        type="button"
        value={text}
        onClick={action}
      />
    );
  };
  const getInactiveIconButton = (text, icon) => {
    return (
      <input className={styles["inactive-button"]} type="button" value={text} />
    );
  };

  const addSuffix = (value, suffix) => value + suffix;

  const getTime = dateValue => {
    const hour = new Date(dateValue).getHours();
    const minutes = new Date(dateValue).getMinutes();
    const type = hour >= 12 ? "PM" : "AM";
    return `${hour % 12}:${minutes} ${type}`;
  };

  const showLoading = () => <div>Loading...</div>;
  const showGrid = () => {
    return (
      <div>
        <WidgetHeader
          title="Today's Appointments"
          icon="svg-icon icon-calender"
        ></WidgetHeader>

        <ReactTable
          data={appointments}
          TheadComponent={_ => null}
          className={styles["table"]}
          columns={[
            {
              id: "time",
              accessor: r =>
                getAsParimaryCell(
                  getTime(r.startDateTime),
                  addSuffix(r.service.durationMins, " mins")
                ),
              className: styles["row"]
            },
            {
              id: "id",
              accessor: r =>
                getAsDataCell(r.patient.name, r.patient.identifier),
              className: styles["row"]
            },
            {
              id: "service",
              accessor: r => getAsColorCell(r.service.name, r.service.color),
              className: styles["row"]
            },
            {
              id: "action",
              accessor: r =>
                r.status === "checkedIn"
                  ? getInactiveIconButton("Checked In", "icon-tick")
                  : getActionButton("Check In", () => alert("checked in")),
              className: styles["row"]
            }
          ]}
          showPaginationBottom={false}
          minRows={0}
        />
      </div>
    );
  };

  return appointments ? showGrid() : showLoading();
}

type AppointmentProps = CommonWidgetProps & {};
