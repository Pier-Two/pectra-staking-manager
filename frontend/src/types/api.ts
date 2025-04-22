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
  status: string;
  validatorindex: number;
  withdrawableepoch: number;
  withdrawalcredentials: string;
  total_withdrawals: number;
}

export interface BeaconChainValidatorArrayDetailsResponse {
  status: string;
  data: BeaconChainValidatorDetails[];
}

export interface BeaconChainValidatorPerformance {
  performance1d: number;
  performance7d: number;
  performance31d: number;
  performance365d: number;
  performanceTotal: number;
  validatorindex: number;
}

export interface BeaconChainValidatorPerformanceResponse {
  status: string;
  data: BeaconChainValidatorPerformance[];
}

export interface BeaconChainValidatorDetailsResponse {
  status: string;
  data: BeaconChainValidatorDetails;
}

export interface CoinGeckoPriceResponse {
  ethereum: {
    usd: number;
  };
}
