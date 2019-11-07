import React from "react";

import defaultTodoColumns from "./config.json";
import buildColumn from "../refapp-grid/column-builder";

export default function getColumns() {
  const getDoneActionColumn = () => {
    return [];
  };

  const getTodoActionColumn = () => {
    const fetchEncounterURL = (patientId, encounterId) => {
      let baseUrl: string = `${location.origin}/openmrs/htmlformentryui/htmlform/viewEncounterWithHtmlForm.page?`;

      return `${baseUrl}patientId=${patientId}&encounter=${encounterId}`;
    };
    const getTodoActionButton = todo => {
      switch (todo.type) {
        case "PRINT_CONSENT":
          return (
            <a
              title="Basic Service Plan Encounter URL"
              href={fetchEncounterURL(todo.patient.id, todo.encounterId)}
            >
              <button className="button">Print</button>
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
