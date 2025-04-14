import type { ValidatorDetails } from "./validator";

export interface IWithdrawalInformation {
  buttonText: string;
  handleMaxAllocation: () => void;
  isValid: boolean;
  onSubmit: () => void;
  resetWithdrawal: () => void;
  stage: EWithdrawalStage;
  validatorsSelected: number;
  withdrawalTotal: number;
}

export interface IWithdrawalSelectionValidatorCard {
  availableAmount: bigint;
  handleSelect: () => void;
  index: number;
  selected: boolean;
  validator: ValidatorDetails;
}

export enum EWithdrawalStage {
  DATA_CAPTURE = "DATA_CAPTURE",
  TRANSACTIONS_SUBMITTED = "TRANSACTIONS_SUBMITTED",
  TRANSACTIONS_CONFIRMED = "TRANSACTIONS_CONFIRMED",
}
