export type DepositWorkflowStage =
  | "data-capture"
  | "sign-data"
  | "transactions-submitted"
  | "transactions-confirmed";

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
