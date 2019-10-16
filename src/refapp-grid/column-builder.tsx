import React, { cloneElement } from "react";
import { formatField, getField } from "./formatters";

import styles from "./refapp-grid.css";
import { JSXElement } from "@babel/types";

const labelComponent = (text: string, styles: string) => (
  <div className={styles}>{text}</div>
);

const buttonComponent = (label: string, styles: string) => (
  <input className={styles} type="button" value={label} />
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
          cellConfig.field
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
