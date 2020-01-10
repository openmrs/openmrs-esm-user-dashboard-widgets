import React from "react";
import { todo as constants } from "../constants.json";

import defaultTodoColumns from "./config";
import buildColumn from "../refapp-grid/column-builder";
import styles from "./todo.css";

import { Trans } from "react-i18next";
import { markTodoAsDone } from "./todo.resource";
import { addTestId } from "../utils/";
import Todo from "./todo.component.js";

export default function getColumns(refreshTodos, showMessage, baseUrl) {
  const markTodoDone = (refreshTodos, showMessage, todo) => {
    const handleResponse = response => {
      if (response.ok) {
        showMessage({
          type: "success",
          message: <Trans>{constants.TODO_DONE_SUCCESS_MESSAGE}</Trans>
        });
        refreshTodos();
      } else {
        response.json().then(err => {
          showMessage({
            type: "error",
            message: <Trans>{constants.TODO_DONE_ERROR_MESSAGE}</Trans>
          });
          console.log(err); // eslint-disable-line no-console
        });
      }
    };

    markTodoAsDone(todo, baseUrl).then(handleResponse);
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
    const fetchClinicalConsentURL = (patientUUId, visitUUId) =>
      `${constants.PRINT_CONSENT_FORM_URL}patientId=${patientUUId}&visitId=${
        visitUUId ? visitUUId : ""
      }&definitionUiResource=${constants.CLINICAL_CONSENT_FORM_URL}`;

    const printConsentButton = todo => (
      <a
        href={fetchClinicalConsentURL(todo.patient.uuid, todo.visitUUId)}
        target="_blank"
      >
        <button className="task button small-button">
          <i className="icon-print" />
          <Trans>Print</Trans>
        </button>
      </a>
    );

    const appointmentConfirmLabel = todo => (
      <span className={styles["confirm-label"]}>
        <i className="icon-phone" /> <Trans>Confirm</Trans>
      </span>
    );

    const getTodoActionButton = todo => {
      switch (todo.type) {
        case "PRINT_CONSENT":
          return printConsentButton(todo);
        case "APPOINTMENT_CONFIRM":
          return appointmentConfirmLabel(todo);
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

  const columns = [
    getMarkDoneActionColumn(refreshTodos, showMessage),
    ...defaultColumns,
    getTodoActionColumn()
  ];
  return addTestId(columns);
}
