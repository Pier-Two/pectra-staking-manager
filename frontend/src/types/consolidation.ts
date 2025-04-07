import type { ValidatorDetails } from "./validator";

export interface IProgressBar {
  progress: number;
  setProgress?: (step: number) => void;
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
  selectedSourceValidators: ValidatorDetails[];
  setProgress: (progress: number) => void;
  setSelectedDestinationValidator: (validator: ValidatorDetails | null) => void;
  setSelectedSourceValidators: (validators: ValidatorDetails[]) => void;
  validators: ValidatorDetails[];
}

export interface IConsolidationSummary {
  destinationValidator: ValidatorDetails;
  setSelectedDestinationValidator: (validator: ValidatorDetails | null) => void;
  setSelectedSourceValidators: (validators: ValidatorDetails[]) => void;
  setProgress: (progress: number) => void;
  summaryEmail: string;
  setSummaryEmail: (email: string) => void;
  sourceValidators: ValidatorDetails[];
}

export interface IConsolidationOverview {
  destinationValidator: ValidatorDetails;
  sourceValidators: ValidatorDetails[];
}

export interface IConsolidationEmail {
  cardText: string;
  cardTitle: string;
  summaryEmail: string;
  setSummaryEmail: (email: string) => void;
}

export interface IConsolidationSubmission {
  consolidationEmail: string;
  destinationValidator: ValidatorDetails;
  setConsolidationEmail: (email: string) => void;
  sourceValidators: ValidatorDetails[];
}
