import { ValidatorDetails } from "./validator";

export enum ESortDirection {
  ASC = "asc",
  DESC = "desc",
}

export interface SortConfig<T> {
  key: keyof T;
  direction: ESortDirection;
}

export interface IHeaderConfig<
  T = ValidatorDetails,
  SortKey = keyof T,
  CustomRenderKey = keyof T,
> {
  label: string;
  sortKey: SortKey;
  customRenderKey?: CustomRenderKey;
  mobile?: boolean;
}
