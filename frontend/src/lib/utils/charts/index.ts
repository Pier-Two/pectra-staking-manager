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
): IChartData[] => {
  const result: IChartData[] = [];

  Object.entries(groupedValidatorStatistics).forEach(
    ([timestampKey, group]) => {
      if (!group) return;

      const date = new Date(timestampKey);
      const month = date.getMonth().toString().padStart(2, "0");
      const year = date.getFullYear().toString().slice(-2);
      const chartKey = `${month}/${year}`;

      let chartEntry = result.find((item) => item.key === chartKey);

      if (!chartEntry) {
        chartEntry = {
          key: chartKey,
          merge: 0,
          shapella: 0,
          pectra: 0,
        };
        result.push(chartEntry);
      }

      Object.entries(WITHDRAWAL_PREFIXES).forEach(([type, prefix]) => {
        const validator = group.find(
          (validator) => validator.withdrawalCredentialPrefix === prefix,
        );

        const field = validator?.[key];
        if (!field) return;

        chartEntry[type as keyof typeof WITHDRAWAL_PREFIXES] += Number(field);
      });
    },
  );

  return result;
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

export const buildXAxis = (): IXAxis => {
  return {
    label: "Month",
    showLabel: false,
    orientation: "bottom",
  };
};
