import { CommonWidgetProps, Condition, LoadingStatus } from "../models";

export type AppointmentProps = CommonWidgetProps & {
  source: AppointmentSource;
  refreshInterval?: number;
  viewAll?: string;
  viewAllWindow?: string;
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
  showFutureAppointments?: boolean;
  filters?: Condition[];
  providerStatusFilterType?: string;
};
