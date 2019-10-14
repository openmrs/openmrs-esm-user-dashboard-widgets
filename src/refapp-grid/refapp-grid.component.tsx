import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";

import buildColumn from "./column-builder";
import styles from "./refapp-grid.css";

export default function RefAppGrid(props: RefAppGridProps) {
  const { data, columns } = props;
  return (
    <ReactTable
      data={data}
      TheadComponent={_ => null}
      className={styles["table"]}
      columns={columns.map(columnConfig => buildColumn(columnConfig))}
      showPaginationBottom={false}
      minRows={0}
    />
  );
}

type RefAppGridProps = {
  data: any;
  columns: any[];
};
