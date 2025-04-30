import {
  TYPE_0_PREFIX,
  TYPE_1_PREFIX,
  TYPE_2_PREFIX,
} from "pec/constants/pectra";
import type {
  TransactionSchema,
  ValidatorDataSchema,
} from "pec/lib/api/schemas/validator";
import type { z } from "zod";

export type ValidatorDetails = z.infer<typeof ValidatorDataSchema>;

export type Transaction = z.infer<typeof TransactionSchema>;

export interface IConnectedAddress {
  address: string;
}

export interface IDetectedValidators {
  cardTitle: string;
  validators: ValidatorDetails[];
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
  EXITED = "Exited",
}

export const VALIDATOR_LIFECYCLE_STATUSES = [
  "pending_initialized",
  "pending_queued",
  "active_ongoing",
  "active_online",
  "active_offline",
  "active_exiting",
  "active_slashed",
  "exited_unslashed",
  "exited",
  "exited_slashed",
  "withdrawal_possible",
  "withdrawal_done",
] as const;

export type ValidatorLifecycleStatus =
  (typeof VALIDATOR_LIFECYCLE_STATUSES)[number];

export enum TransactionStatus {
  IN_PROGRESS = "In Progress",
  UPCOMING = "Upcoming",
  SUBMITTED = "Submitted",
}

export type WithdrawalAddressPrefixType =
  | typeof TYPE_2_PREFIX
  | typeof TYPE_1_PREFIX
  | typeof TYPE_0_PREFIX;
