import type { ValidatorDetails } from "./validator";

export interface IBatchDepositValidators {
  validator: ValidatorDetails;
  depositAmount: number;
}

export interface IDistributionMethod {
  changeDistributionMethod: () => void;
  disableButton: boolean;
  distributionMethod: EDistributionMethod;
  setDistributionMethod: (method: EDistributionMethod) => void;
  setTotalToDistribute: (total: number) => void;
  selectedValidators: IBatchDepositValidators[];
  totalAllocated: number;
  totalToDistribute: number;
  walletBalance: number;
}

export interface IDistributionInformation {
  disableButton: boolean;
  selectedValidators: IBatchDepositValidators[];
  totalAllocated: number;
  totalToDistribute: number;
}

export interface ISelectValidators {
  clearSelectedValidators: () => void;
  distributionMethod: EDistributionMethod;
  selectedValidators: IBatchDepositValidators[];
  setSelectedValidators: (validator: IBatchDepositValidators) => void;
  totalAllocated: number;
  totalToDistribute: number;
  validators: ValidatorDetails[];
}

export enum EDistributionMethod {
  SPLIT = "SPLIT",
  MANUAL = "MANUAL",
}
