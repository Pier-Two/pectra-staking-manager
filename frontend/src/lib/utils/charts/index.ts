import { WITHDRAWAL_PREFIXES } from "pec/constants/api";
import type {
  IChartData,
  IGroupedValidatorStatistics,
  IXAxis,
  IYAxis,
} from "pec/types/chart";

export const buildChartData = (
  groupedValidatorStatistics: IGroupedValidatorStatistics,
  key: keyof Pick<
    IGroupedValidatorStatistics[string][number],
    "count" | "totalStaked" | "avgStaked"
  >,
  filter: "days" | "months" | "years",
): IChartData[] => {
  const chartMap = new Map<string, IChartData>();

  Object.entries(groupedValidatorStatistics).forEach(
    ([timestampKey, group]) => {
      if (!group || group.length === 0) return;
      const chartKey = buildChartKey(new Date(timestampKey), filter);

      if (!chartMap.has(chartKey)) {
        chartMap.set(chartKey, {
          key: chartKey,
          merge: 0,
          shapella: 0,
          pectra: 0,
        });
      }

      const chartEntry = chartMap.get(chartKey)!;

      for (const [type, prefix] of Object.entries(WITHDRAWAL_PREFIXES)) {
        const validatorsOfType = group.filter(
          (validator) => validator.withdrawalCredentialPrefix === prefix,
        );

        if (validatorsOfType.length === 0) continue;

        const maxValue = Math.max(
          ...validatorsOfType
            .map((validator) => Number(validator[key] || 0))
            .filter((val) => !isNaN(val)),
        );

        const typeKey = type as keyof typeof WITHDRAWAL_PREFIXES;
        if (maxValue > chartEntry[typeKey]) chartEntry[typeKey] = maxValue;
      }
    },
  );

  return Array.from(chartMap.values());
};

const buildChartKey = (date: Date, filter: "days" | "months" | "years") => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.getMonth().toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  if (filter === "days") return `${day}/${month}/${year}`;
  if (filter === "years") return `${year}`;
  return `${month}/${year}`;
};

export const buildYAxis = (
  chartData: IChartData[],
  label: string,
  showLabel: boolean,
  orientation: "left" | "right",
): IYAxis => {
  const lowerRange = chartData.reduce(
    (min, item) => Math.min(min, item.pectra, item.merge, item.shapella),
    Infinity,
  );

  const upperRange = chartData.reduce(
    (max, item) => Math.max(max, item.pectra, item.merge, item.shapella),
    0,
  );

  const step = (upperRange - lowerRange) / 9;
  const ticks = Array.from({ length: 10 }, (_, i) =>
    Math.round(lowerRange + i * step),
  );

  return {
    lowerRange,
    upperRange,
    ticks,
    label,
    showLabel,
    orientation,
  };
};

export const buildXAxis = (filter: "days" | "months" | "years"): IXAxis => {
  return {
    label: filter === "days" ? "Day" : filter === "months" ? "Month" : "Year",
    showLabel: false,
    orientation: "bottom",
  };
};
