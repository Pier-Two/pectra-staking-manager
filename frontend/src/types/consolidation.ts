import { type SubmittingConsolidationValidatorDetails } from "pec/constants/columnHeaders";
import { type ValidatorDetails } from "./validator";

export const CONSOLIDATION_STEPS: Record<ConsolidationStep, number> = {
  destination: 1,
  source: 2,
  summary: 3,
  submit: 4,
} as const;

export const CONSOLIDATION_STEP_NUMBER_TO_NAME = Object.entries(
  CONSOLIDATION_STEPS,
).reduce(
  (acc, [key, value]) => {
    acc[value] = key as ConsolidationStep;
    return acc;
  },
  {} as Record<number, ConsolidationStep>,
);

export interface ConsolidationTransactionDetails {
  transactions: SubmittingConsolidationValidatorDetails[];
  upgradeTransactions: number;
  consolidationTransactions: number;
}

export type ConsolidationWorkflowStages =
  | { stage: "destination" }
  | {
      stage: "source";
      destinationValidator: ValidatorDetails;
      sourceValidator: ValidatorDetails[];
    }
  | {
      stage: "summary";
      destinationValidator: ValidatorDetails;
      sourceValidator: ValidatorDetails[];
      transactions: ConsolidationTransactionDetails;
    }
  | {
      stage: "submit";
      destinationValidator: ValidatorDetails;
      sourceValidator: ValidatorDetails[];
      transactions: ConsolidationTransactionDetails;
    };

export type ConsolidationStep = ConsolidationWorkflowStages["stage"];
