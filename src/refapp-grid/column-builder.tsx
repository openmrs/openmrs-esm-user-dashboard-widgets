import React from "react";
import { formatField, getField } from "./formatters";

import styles from "./refapp-grid.css";

const getAccessor = (rowData, cellConfigs: CellConfig[]) => {
  const labelComponent = (text: string, styles: string) => (
    <div className={styles}>{text}</div>
  );

  const buttonComponent = (label: string, styles: string) => (
    <input className={styles} type="button" value={label} />
  );

  const colorCircleComponent = (color: string) => (
    <div className="circle" style={{ background: color }} />
  );

  return (
    <div>
      {cellConfigs.map(cellConfig => {
        const cellValue = cellConfig.formatter
          ? formatField(rowData, cellConfig.field, cellConfig.formatter)
          : getField(rowData, cellConfig.field);

        switch (cellConfig.type) {
          case "label":
            return labelComponent(cellValue, cellConfig.styles);
          case "button":
            return buttonComponent(cellConfig.label, "task button small");
          case "colorCircle":
            return colorCircleComponent(cellValue);
          default:
            return <div></div>;
        }
      })}
    </div>
  );
};

export default function buildColumn(config: ColumnConfig): ReactColumn {
  const column: ReactColumn = {
    accessor: rowData => getAccessor(rowData, config.cells)
  };

  let buildColumnId = cells =>
    cells.reduce((id, cellConfig) => `${id}-${cellConfig.field}`, "");

  column.id = config.id ? config.id : buildColumnId(config.cells);
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
