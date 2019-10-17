export type CommonWidgetProps = {
  locale: string;
  title?: string;
};

export enum LoadingStatus {
  Loading = 0,
  Loaded,
  Failed
}
