import { type TransactionStatus } from "./withdraw";

export type DepositWorkflowStage =
  | { type: "data-capture" }
  | { type: "sign-submit"; transactionStatus: TransactionStatus };

export interface IDistributionOptionProps {
  option: IDistributionOption;
  isSelected: boolean;
  onClick: () => void;
}

export interface IDistributionOption {
  method: EDistributionMethod;
  title: string;
  description: string;
}

export enum EDistributionMethod {
  SPLIT = "SPLIT",
  MANUAL = "MANUAL",
}
