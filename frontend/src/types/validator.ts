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

export interface IGenericValidators {
  validators: ValidatorDetails[];
}

export interface IValidatorCard {
  validator: ValidatorDetails;
  onClick?: () => void;
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
