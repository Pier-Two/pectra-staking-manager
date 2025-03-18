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
  consolidatedTotal: number;
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
  consolidatedTotal: number;
  validator: ValidatorDetails;
  selectedSourceTotal: number;
}

export interface IConsolidationSummary {
  destinationValidator: ValidatorDetails;
  setSelectedDestinationValidator: (validator: ValidatorDetails | null) => void;
  setProgress: (progress: number) => void;
  sourceValidators: ValidatorDetails[];
}

export interface IConsolidationOverview {
  destinationValidator: ValidatorDetails;
  sourceValidators: ValidatorDetails[];
}

export interface IConsolidationEmail {
  cardText: string;
}
