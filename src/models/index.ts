export type CommonWidgetProps = {
  language: string;
  title?: string;
};

export enum LoadingStatus {
  Loading = 0,
  Loaded,
  Failed
}
