import type { UseFormSetValue } from "react-hook-form";
import type { ValidatorDetails } from "./validator";
import type { SortDirection } from "pec/components/batch-deposits/validators/ColumnHeader";
import type { DepositType } from "pec/lib/api/schemas/deposit";

export interface IBatchDepositValidators {
  validator: ValidatorDetails;
  amount: number;
}

export interface IDepositWorkflowProps {
  data: ValidatorDetails[];
  balance: number;
}
export interface IDistributionInformation {
  buttonText: string;
  disableButton: boolean;
  onSubmit?: () => void;
  resetBatchDeposit: () => void;
  selectedValidators: ValidatorDetails[];
  stage: EBatchDepositStage;
  setValue?: UseFormSetValue<DepositType>;
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
  onSubmit: () => void;
  resetBatchDeposit: () => void;
  selectedValidators: ValidatorDetails[];
  stage: EBatchDepositStage;
  setValue: UseFormSetValue<DepositType>;
  totalAllocated: number;
  totalToDistribute: number;
  walletBalance: number;
}

export interface ISelectValidatorsProps {
  clearSelectedValidators: () => void;
  distributionMethod: EDistributionMethod;
  handleValidatorSelect: (validator: ValidatorDetails) => void;
  selectedValidators: ValidatorDetails[];
  totalAllocated: number;
  totalToDistribute: number;
  watchedDeposits: IBatchDepositValidators[];
  validators: ValidatorDetails[];
}

export interface IValidatorHeaderProps {
  label: string;
  showSort: boolean;
  sortDirection: SortDirection;
  onSort: () => void;
}

export interface IDepositSelectionValidatorCard {
  distributionMethod: EDistributionMethod;
  depositAmount: number;
  handleSelect: () => void;
  index: number;
  selected: boolean;
  totalAllocated: number;
  totalToDistribute: number;
  validator: ValidatorDetails;
}

export interface ITotalAmountInput {
  amount: number;
  walletBalance: number;
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
  totalAllocated: number;
  totalToDistribute: number;
}

interface IColumnHeader {
  label: string;
  showSort: boolean;
}

export interface IValidatorListHeaders {
  columnHeaders: IColumnHeader[];
  sortColumn: string;
  sortDirection: SortDirection;
  onSort: (column: string) => void;
}

export interface IDepositSignDataCard {
  deposit: IBatchDepositValidators;
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
