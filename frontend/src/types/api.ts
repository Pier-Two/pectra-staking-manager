import type { ValidatorLifecycleStatus } from "./validator";
interface BeaconChainAllValidators {
  publickey: string;
  valid_signature: boolean;
  validatorindex: number;
}

export interface BeaconChainAllValidatorsResponse {
  status: string;
  data: BeaconChainAllValidators[];
}

export interface BeaconChainValidatorDetails {
  activationeligibilityepoch: number;
  activationepoch: number;
  balance: number;
  effectivebalance: number;
  exitepoch: number;
  lastattestationslot: number;
  name: string;
  pubkey: string;
  slashed: boolean;
  status: ValidatorLifecycleStatus;
  validatorindex: number;
  withdrawableepoch: number;
  withdrawalcredentials: string;
  total_withdrawals: number;
}

export interface BeaconChainValidatorArrayDetailsResponse {
  status: string;
  data: BeaconChainValidatorDetails[];
}

export interface BeaconChainValidatorDetailsResponse {
  status: string;
  data: BeaconChainValidatorDetails;
}
