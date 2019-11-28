import React from "react";
import { openmrsFetch } from "@openmrs/esm-api";
import { todo as constants } from "../constants.json";

import defaultTodoColumns from "./config.json";
import buildColumn from "../refapp-grid/column-builder";
import styles from "./todo.css";

import { Trans } from "react-i18next";

export default function getColumns(refreshTodos, showMessage) {
  const markDoneUrl = (todoUuid: string) =>
    `/ws/rest/v1/assignedaction/${todoUuid}/complete`;

  const markTodoDone = (refreshTodos, showMessage, todo) => {
    const handleMarkDoneResponse = response => {
      if (response.ok) {
        showMessage({
          type: "success",
          message: <Trans>{constants.CHECK_IN_SUCCESS_MESSAGE}</Trans>
        });
        refreshTodos();
      } else {
        response.json().then(err => {
          showMessage({
            type: "error",
            message: <Trans>{constants.CHECK_IN_ERROR_MESSAGE}</Trans>
          });
          console.log(err); // eslint-disable-line no-console
        });
      }
    };

    const checkInRequestInit = {
      method: "PATCH",
      body: "",
      headers: {
        "Content-Type": "application/json"
      }
    };

    openmrsFetch(markDoneUrl(todo.uuid), checkInRequestInit).then(response => {
      handleMarkDoneResponse(response);
    });
  };

  const getMarkDoneActionColumn = (refreshTodos, showMessage) => {
    const getMarkDoneActionButton = todo => {
      return (
        <button
          data-testid="submit"
          className={styles["mark-done"]}
          onClick={() => markTodoDone(refreshTodos, showMessage, todo)}
        >
          <i className={"icon-ok"}></i>
        </button>
      );
    };
    return {
      id: "markDoneButton",
      accessor: getMarkDoneActionButton
    };
  };

  const getTodoActionColumn = () => {
    const fetchEncounterURL = (patientId, encounterId) => {
      const baseUrl: string = `/openmrs/htmlformentryui/htmlform/viewEncounterWithHtmlForm.page?`;

      return `${baseUrl}patientId=${patientId}&encounter=${encounterId}`;
    };
    const getTodoActionButton = todo => {
      switch (todo.type) {
        case "PRINT_CONSENT":
          return (
            <a href={fetchEncounterURL(todo.patient.id, todo.encounterId)}>
              <button className="task button small-button">
                <i className="icon-print" />
                <Trans>Print</Trans>
              </button>
            </a>
          );
      }
    };
    return {
      id: "todoAction",
      accessor: getTodoActionButton
    };
  };

  const defaultColumns = defaultTodoColumns.columns.map(columnConfig =>
    buildColumn(columnConfig)
  );

  return [
    getMarkDoneActionColumn(refreshTodos, showMessage),
    ...defaultColumns,
    getTodoActionColumn()
  ];
}
