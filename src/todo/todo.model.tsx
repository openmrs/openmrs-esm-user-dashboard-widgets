import { CommonWidgetProps } from "../models";

export type TodoProps = CommonWidgetProps & {
  source: TodoSource;
  viewAll?: string;
  refreshInterval?: number;
};

export type TodoSource = {
  url: string;
  limit?: number;
  showDone?: boolean;
};
