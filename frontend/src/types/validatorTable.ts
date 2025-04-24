export enum ESortDirection {
  ASC = "asc",
  DESC = "desc",
}

export interface SortConfig {
  key: string;
  direction: ESortDirection;
}

export interface IHeaderConfig {
  label: string;
  sortKey: string;
}
