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

const getCellValue = (valueAccessor, data, formatter) => {
  const fieldValue =
    typeof valueAccessor === "function"
      ? valueAccessor(data)
      : getField(data, valueAccessor);
  return formatter ? formatField(data, fieldValue, formatter) : fieldValue;
};

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
    `${cellConfig.valueAccessor}-${getFormatterName(cellConfig.formatter)}`;

  return (
    <>
      {cellConfigs.map(cellConfig => {
        const cellValue = getCellValue(
          cellConfig.valueAccessor,
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
  const cellConfigId = cellConfig =>
    cellConfig.id ? cellConfig.id : Math.floor(1000 + Math.random() * 9000);

  const getCellId = cellConfig => {
    return typeof cellConfig.valueAccessor === "function"
      ? cellConfigId(cellConfig)
      : cellConfig.valueAccessor;
  };

  let getDynamicColumnId = cells => {
    return cells
      ? cells.map(cellConfig => getCellId(cellConfig)).join("-")
      : "";
  };

  const column: ReactColumn = {
    accessor: rowData => getAccessor(rowData, config.cells)
  };

  column.id = config.id ? config.id : getDynamicColumnId(config.cells);
  column.className = `${styles["row"]} ${config.styles ? config.styles : ""}`;

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
  valueAccessor: string | Function;
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
