import { type BeaconChainValidatorPerformance } from "pec/types/api";

export const PERFORMANCE_FILTERS = [
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "overall",
] as const;

export type PerformanceFilter = (typeof PERFORMANCE_FILTERS)[number];

export const VALIDATOR_PERFORMANCE_FILTER_TO_BEACONCHAIN: Record<
  PerformanceFilter,
  keyof BeaconChainValidatorPerformance
> = {
  daily: "performance1d",
  weekly: "performance7d",
  monthly: "performance31d",
  yearly: "performance365d",
  overall: "performanceTotal",
};
