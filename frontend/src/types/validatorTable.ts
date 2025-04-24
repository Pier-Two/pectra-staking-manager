export enum ESortDirection {
  ASC = "asc",
  DESC = "desc",
}

export interface SortConfig<T> {
  key: keyof T;
  direction: ESortDirection;
}

export interface IHeaderConfig {
  label: string;
  sortKey: string;
}
