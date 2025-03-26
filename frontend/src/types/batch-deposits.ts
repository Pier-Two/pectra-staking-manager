import type { ValidatorDetails } from "./validator";

export interface IBatchDepositValidators {
  validator: ValidatorDetails;
  depositAmount: number;
}

export interface IDistributionInformation {
  buttonText: string;
  disableButton: boolean;
  onClick: () => void;
  resetBatchDeposit: () => void;
  selectedValidators: IBatchDepositValidators[];
  stage: EBatchDepositStage;
  setStage?: (stage: EBatchDepositStage) => void;
  totalAllocated: number;
  totalToDistribute: number;
}

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

export interface IBatchDepositState {
  distributionMethod: EDistributionMethod;
  selectedValidators: IBatchDepositValidators[];
  totalToDistribute: number;
  totalAllocated: number;
}

export interface IDistributionMethodProps {
  disableButton: boolean;
  distributionMethod: EDistributionMethod;
  onDistributionMethodChange: (method: EDistributionMethod) => void;
  onTotalAmountChange: (amount: number) => void;
  resetBatchDeposit: () => void;
  selectedValidators: IBatchDepositValidators[];
  stage: EBatchDepositStage;
  setStage: (stage: EBatchDepositStage) => void;
  totalAllocated: number;
  totalToDistribute: number;
  walletBalance: number;
}

export interface ISelectValidatorsProps {
  clearSelectedValidators: () => void;
  distributionMethod: EDistributionMethod;
  handleDepositAmountChange: (validator: IBatchDepositValidators) => void;
  selectedValidators: IBatchDepositValidators[];
  setSelectedValidators: (validator: IBatchDepositValidators) => void;
  totalAllocated: number;
  totalToDistribute: number;
  validators: ValidatorDetails[];
}

export interface IValidatorHeaderProps {
  label: string;
  showSort?: boolean;
}

export interface IDepositSelectionValidatorCard {
  clearedSelectedValidators: boolean;
  depositAmount: number;
  distributionMethod: EDistributionMethod;
  selected: boolean;
  setClearedSelectedValidators: (cleared: boolean) => void;
  totalAllocated: number;
  totalToDistribute: number;
  validator: ValidatorDetails;
  onClick: (validator: ValidatorDetails, depositAmount: number) => void;
  onDepositChange: (deposit: IBatchDepositValidators) => void;
}

export interface ITotalAmountInput {
  amount: number;
  walletBalance: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface IWalletBalance {
  balance: number;
}

export interface IValidatorHeader {
  selectedCount: number;
  totalCount: number;
  onClear: () => void;
}

export interface ISignatureDetails {
  title: string;
  text: string;
}

export interface IDepositList {
  deposits: IBatchDepositValidators[];
  resetBatchDeposit: () => void;
  setStage: (stage: EBatchDepositStage) => void;
  stage: EBatchDepositStage;
  totalAllocated: number;
  totalToDistribute: number;
}

export interface IValidatorListHeaders {
  labels: string[];
}
export interface IDepositSignDataCard {
  deposit: IBatchDepositValidators;
  index: number;
  stage: EBatchDepositStage;
}

export enum EDistributionMethod {
  SPLIT = "SPLIT",
  MANUAL = "MANUAL",
}

export enum EBatchDepositStage {
  DATA_CAPTURE = "DATA_CAPTURE",
  SIGN_DATA = "SIGN_DATA",
  TRANSACTIONS_SUBMITTED = "TRANSACTIONS_SUBMITTED",
  TRANSACTIONS_CONFIRMED = "TRANSACTIONS_CONFIRMED",
}
