import type { ValidatorDetails } from "./validator";

export interface IProgressBar {
  progress: number;
  setProgress?: (step: number) => void;
}

export interface ISourceValidatorList {
  sourceValidators: ValidatorDetails[];
  setSourceValidators: (validator: ValidatorDetails) => void;
  validators: ValidatorDetails[];
}

export interface IConsolidationEmail {
  cardText: string;
  cardTitle: string;
  summaryEmail: string;
  setSummaryEmail: (email: string) => void;
}
