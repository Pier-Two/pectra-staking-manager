import { ValidatorDetails } from "./validator";

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

export type ConsolidationWorkflowStages =
  | { stage: "destination" }
  | {
      stage: "source";
      destination: ValidatorDetails;
      source: ValidatorDetails[];
    }
  | {
      stage: "summary";
      destination: ValidatorDetails;
      source: ValidatorDetails[];
    }
  | {
      stage: "submit";
      destination: ValidatorDetails;
      source: ValidatorDetails[];
    };

export type ConsolidationStep = ConsolidationWorkflowStages["stage"];
