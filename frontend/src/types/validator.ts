import type {
  TransactionSchema,
  ValidatorDataSchema,
} from "pec/lib/api/schemas/validator";
import type { z } from "zod";

export type ValidatorDetails = z.infer<typeof ValidatorDataSchema>;

export type Transaction = z.infer<typeof TransactionSchema>;

export interface IConnector {
  title?: string;
  description?: string;
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

export interface IGenericValidators {
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

export type ValidatorLifecycleStatus =
  | "pending_initialized"
  | "pending_queued"
  | "active_ongoing"
  | "active_online"
  | "active_offline"
  | "active_exiting"
  | "active_slashed"
  | "exited_unslashed"
  | "exited"
  | "exited_slashed"
  | "withdrawal_possible"
  | "withdrawal_done";

export enum TransactionStatus {
  IN_PROGRESS = "In Progress",
  UPCOMING = "Upcoming",
  SUBMITTED = "Submitted",
}
