import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";

import styles from "./refapp-grid.css";
import { Trans } from "react-i18next";

export default function RefAppGrid(props: RefAppGridProps) {
  const { data, columns = [], noDataText = "No records found" } = props;

  const NoDataComponent = () => {
    return (
      <div className={styles["no-rows-text"]}>
        <Trans>{noDataText}</Trans>
      </div>
    );
  };

  return (
    <ReactTable
      data={data}
      TheadComponent={_ => null}
      className={styles["table"]}
      columns={columns}
      showPaginationBottom={false}
      minRows={0}
      NoDataComponent={NoDataComponent}
    />
  );
}

type RefAppGridProps = {
  data: any;
  columns?: any[];
  noDataText?: string;
};
