import { CommonWidgetProps, Condition, LoadingStatus } from "../models";

export type AppointmentProps = CommonWidgetProps & {
  source: AppointmentSource;
  refreshInterval?: number;
  viewAll?: string;
  actions?: WidgetAction[];
};

export type WidgetAction = {
  name: string;
  when: Condition[];
};

export type AppointmentSource = {
  url: string;
  fetchType?: string;
  fromTimeDelayInMinutes?: number;
  removeEndDate?: boolean;
  filters?: Condition[];
};
