import { ValidatorDetails } from "./validator";
import { TransactionStatus } from "./withdraw";

export enum ESortDirection {
  ASC = "asc",
  DESC = "desc",
}

export interface SortConfig<T> {
  key: keyof T;
  direction: ESortDirection;
}

export type TableValidatorDetails = ValidatorDetails & {
  transactionStatus?: TransactionStatus;
};

export interface IHeaderConfig<T = TableValidatorDetails, SortKey = keyof T> {
  label: string;
  sortKey: SortKey;
  mobile?: boolean;
}
