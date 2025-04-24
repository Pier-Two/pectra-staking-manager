export type ConsolidationStep = "destination" | "source" | "summary" | "submit";

export const CONSOLIDATION_STEPS: Record<ConsolidationStep, number> = {
  destination: 1,
  source: 2,
  summary: 3,
  submit: 4,
} as const;
