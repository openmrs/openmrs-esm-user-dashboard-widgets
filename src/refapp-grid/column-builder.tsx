import React, { cloneElement } from "react";
import { Trans } from "react-i18next";
import { formatField } from "./formatters";
import { getField } from "../utils";

import styles from "./refapp-grid.css";

const labelComponent = (text: string, styles: string) => (
  <div className={styles}>
    <Trans>{text}</Trans>
  </div>
);

const buttonComponent = (label: string, styles: string) => (
  <button className={styles}>
    <Trans>{label}</Trans>
  </button>
);

const colorCircleComponent = (color: string) => (
  <div className="circle" style={{ background: color }} />
);

const getCellValue = (field, data, formatter) =>
  formatter ? formatField(data, field, formatter) : getField(data, field);

const appendKey = (element: JSX.Element, key: string) => {
  return cloneElement(element, { key });
};

const generateElement = (value, config) => {
  switch (config.type) {
    case "label":
      return labelComponent(value, config.styles);
    case "button":
      return buttonComponent(config.label, "task button small-button");
    case "colorCircle":
      return colorCircleComponent(value);
    default:
      return <></>;
  }
};

const getAccessor = (rowData, cellConfigs: CellConfig[]) => {
  if (!cellConfigs) {
    return <></>;
  }

  const getFormatterName = formatter =>
    formatter
      ? typeof formatter === "string"
        ? formatter
        : formatter.name
      : "";
  const getCellKey = cellConfig =>
    `${cellConfig.field}-${getFormatterName(cellConfig.formatter)}`;

  return (
    <>
      {cellConfigs.map(cellConfig => {
        const cellValue = getCellValue(
          cellConfig.field,
          rowData,
          cellConfig.formatter
        );
        return appendKey(
          generateElement(cellValue, cellConfig),
          getCellKey(cellConfig)
        );
      })}
    </>
  );
};

export default function buildColumn(config: ColumnConfig): ReactColumn {
  let getDynaicColumnId = cells =>
    cells ? cells.map(cellConfig => cellConfig.field).join("-") : "";

  const column: ReactColumn = {
    accessor: rowData => getAccessor(rowData, config.cells)
  };

  column.id = config.id ? config.id : getDynaicColumnId(config.cells);
  column.className = `${styles["row"]} ${config.styles}`;

  return column;
}

type ColumnConfig = {
  id?: string;
  cells: CellConfig[];
  styles?: string;
};

type CellConfig = {
  type: string;
  styles?: string;
  field: string;
  formatter?:
    | {
        name: string;
        args?: any[];
      }
    | string;
  label?: string;
};

type ReactColumn = {
  id?: string;
  accessor: any;
  className?: string;
};
