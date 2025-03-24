import type { EDistributionMethod } from "./batch-deposits";

export interface ValidatorDetails {
  validatorIndex: number;
  publicKey: string;
  withdrawalAddress: string;
  balance: number;
  effectiveBalance: number;
  status: ValidatorStatus;
  numberOfWithdrawals: number;
  activeSince: string;
  activeDuration: string;
  apy: number;
  transactionStatus: TransactionStatus;
  transactionHash: string;
}

export interface IConnector {
  connectedAddress: string;
  validators: ValidatorDetails[];
}

export interface IConnectedAddress {
  address: string;
}

export interface IDetectedValidators {
  cardTitle: string;
  validators: ValidatorDetails[];
}

export interface IGenericValidator {
  validator: ValidatorDetails;
}

export interface IGenericValidators {
  validators: ValidatorDetails[];
}

export interface IValidatorCard {
  hasBackground: boolean;
  hasHover: boolean;
  shrink: boolean;
  validator: ValidatorDetails;
  onClick?: () => void;
}

export interface ITransactionValidatorCard {
  status: TransactionStatus;
  transactionHash: string;
  validator: ValidatorDetails;
}

export interface IBatchDepositValidatorCard {
  depositAmount: number;
  distributionMethod: EDistributionMethod;
  selected: boolean;
  totalAllocated: number;
  totalToDistribute: number;
  validator: ValidatorDetails;
  onClick: (validator: ValidatorDetails, distributionMethod: EDistributionMethod, depositAmount: number) => void;
}

export interface ISourceValidatorCard {
  checked: boolean;
  onClick: () => void;
  validator: ValidatorDetails;
}

export enum ValidatorStatus {
  ACTIVE = "Active",
  PENDING = "Pending",
  INACTIVE = "Inactive",
}

export enum TransactionStatus {
  IN_PROGRESS = "In Progress",
  UPCOMING = "Upcoming",
  SUBMITTED = "Submitted",
}
