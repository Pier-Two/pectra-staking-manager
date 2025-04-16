export type DepositWorkflowStage =
  | { type: "data-capture" }
  | { type: "sign-data" }
  | { type: "transactions-submitted"; txHash: string }
  | { type: "transactions-finalised"; txHash: string };

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
