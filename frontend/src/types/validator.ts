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
}

export interface IConnector {
  connectedAddress: string;
  validators: ValidatorDetails[];
}

export interface IConnectedAddress {
  address: string;
}

export interface IDetectedValidators {
  validators: ValidatorDetails[];
}

export interface IValidatorCard {
  validator: ValidatorDetails;
}

export interface IValidatorInformation {
  validators: ValidatorDetails[];
}

export enum ValidatorStatus {
  ACTIVE = "Active",
  PENDING = "Pending",
  INACTIVE = "Inactive",
}
