type ValidatorStatus =
  | "pending_initialized"
  | "pending_queued"
  | "active_ongoing"
  | "active_exiting"
  | "active_slashed"
  | "exited_unslashed"
  | "exited_slashed"
  | "withdrawal_possible"
  | "withdrawal_done";

type Validator = {
  pubkey: string; // 48-bytes, hex encoded with 0x prefix
  withdrawal_credentials: string;
  effective_balance: string; // balance at stake in Gwei
  slashed: string; // whether the validator is slashed
  activation_eligibility_epoch: string; // when criteria for activation were met
  activation_epoch: string; // epoch when validator activated
  exit_epoch: string; // epoch when validator exited
  withdrawable_epoch: string; // when validator can withdraw funds
};

type Data = {
  index: string; // the index of validator in the validator registry
  balance: string; // current validator balance in gwei
  status: ValidatorStatus; // validator status
  validator: Validator;
};

export type ValidatorsResponseData = {
  execution_optimistic: boolean;
  data: Data[];
};

export type ValidatorUpgradeSummary = {
  count: number;
  balance: bigint;
};

export type ValidatorUpgradeSummaryObject = {
  "0x00": ValidatorUpgradeSummary;
  "0x01": ValidatorUpgradeSummary;
  "0x02": ValidatorUpgradeSummary;
  other: ValidatorUpgradeSummary;
};
