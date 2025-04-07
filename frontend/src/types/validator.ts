import type {
  EDistributionMethod,
  IBatchDepositValidators,
} from "./batch-deposits";

export interface ValidatorDetails {
  validatorIndex: number;
  publicKey: string;
  withdrawalAddress: string;
  balance: bigint;
  effectiveBalance: bigint;
  status: ValidatorStatus;
  numberOfWithdrawals: number;
  activeSince: string;
  activeDuration: string;
  withdrawalTransaction: Transaction | undefined;
  consolidationTransaction: Transaction | undefined;
  depositTransaction: Transaction | undefined;
}

interface Transaction {
  hash: string;
  status: TransactionStatus;
}

export type ValidatorDetailsResponse = Omit<
  ValidatorDetails,
  "transactionStatus" | "transactionHash"
>;

export interface IConnector {
  connectedAddress: string;
  textAlignment: "left" | "center";
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
  clearedSelectedValidators: boolean;
  depositAmount: number;
  distributionMethod: EDistributionMethod;
  selected: boolean;
  setClearedSelectedValidators: (cleared: boolean) => void;
  totalAllocated: number;
  totalToDistribute: number;
  validator: ValidatorDetails;
  onClick: (
    validator: ValidatorDetails,
    distributionMethod: EDistributionMethod,
    depositAmount: number,
  ) => void;
  onDepositChange: (validator: IBatchDepositValidators) => void;
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
