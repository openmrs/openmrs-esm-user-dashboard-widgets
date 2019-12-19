export type CommonWidgetProps = {
  locale: string;
  title?: string;
  showMessage: any;
  provider?: string;
};

export enum LoadingStatus {
  Loading = 0,
  Loaded,
  Failed
}

export type Condition = {
  field: string;
  values: string[];
};
