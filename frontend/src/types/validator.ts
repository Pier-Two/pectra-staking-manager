import { z } from "zod";
import type {
  EDistributionMethod,
  IBatchDepositValidators,
} from "./batch-deposits";
import {
  TransactionSchema,
  ValidatorDataSchema,
} from "pec/lib/api/schemas/validator";

export type ValidatorDetails = z.infer<typeof ValidatorDataSchema>;

export type Transaction = z.infer<typeof TransactionSchema>;

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

export interface IBatchDepositValidatorCard {
  clearedSelectedValidators: boolean;
  depositAmount: bigint;
  distributionMethod: EDistributionMethod;
  selected: boolean;
  setClearedSelectedValidators: (cleared: boolean) => void;
  totalAllocated: bigint;
  totalToDistribute: number;
  validator: ValidatorDetails;
  onClick: (
    validator: ValidatorDetails,
    distributionMethod: EDistributionMethod,
    depositAmount: bigint,
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
