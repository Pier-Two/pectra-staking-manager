import type { ValidatorDetails } from "./validator";

export interface IProgressBar {
  progress: number;
}

export interface IDestinationValidatorList {
  setProgress: (progress: number) => void;
  setSelectedValidator: (validator: ValidatorDetails | null) => void;
  validators: ValidatorDetails[];
}

export interface ISourceValidatorList {
  sourceValidators: ValidatorDetails[]; 
  setSourceValidators: (validator: ValidatorDetails) => void;
  validators: ValidatorDetails[];
}

export interface ISelectDestinationValidator {
  setProgress: (progress: number) => void;
  setSelectedDestinationValidator: (validator: ValidatorDetails | null) => void;
  validators: ValidatorDetails[];
}

export interface ISelectSourceValidators {
  destinationValidator: ValidatorDetails;
  selectedSourceTotal: number;
  selectedSourceValidators: ValidatorDetails[];
  setProgress: (progress: number) => void;
  setSelectedDestinationValidator: (validator: ValidatorDetails | null) => void;
  setSelectedSourceTotal: (total: number) => void;
  setSelectedSourceValidators: (validators: ValidatorDetails[]) => void;
  validators: ValidatorDetails[];
}

export interface IDestinationValidatorDetails {
  validator: ValidatorDetails;
  selectedSourceTotal: number;
}
