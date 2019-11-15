import React from "react";

import defaultTodoColumns from "./config.json";
import buildColumn from "../refapp-grid/column-builder";

import { Trans } from "react-i18next";

export default function getColumns() {
  const getDoneActionColumn = () => {
    return [];
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

  return [...getDoneActionColumn(), ...defaultColumns, getTodoActionColumn()];
}
