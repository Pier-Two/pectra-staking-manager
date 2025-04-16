import type {
  TransactionSchema,
  ValidatorDataSchema,
} from "pec/lib/api/schemas/validator";
import type { z } from "zod";

export type ValidatorDetails = z.infer<typeof ValidatorDataSchema>;

export type Transaction = z.infer<typeof TransactionSchema>;

export interface IConnector {
  title: string;
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

export interface IValidatorCard {
  hasHover: boolean;
  shrink: boolean;
  validator: ValidatorDetails;
  onClick?: () => void;
  info?: string;
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
