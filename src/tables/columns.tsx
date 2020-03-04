import buildColumn from "../refapp-grid/column-builder";
import { addTestId } from "../utils";

export default function getColumns(config) {
  const defaultColumns = config.columns.map(columnConfig =>
    buildColumn(columnConfig)
  );

  return addTestId(defaultColumns);
}
