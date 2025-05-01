import type {
  IChartData,
  IGroupedValidatorStatistics,
  IXAxis,
  IYAxis,
} from "pec/types/chart";
import { WITHDRAWAL_PREFIXES } from "pec/constants/api";

const convertGweiToEth = (value: number): number => value / 1e9;

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
            .map((validator) => {
              const value = Number(validator[key] || 0);
              return key === "count" ? value : convertGweiToEth(value);
            })
            .filter((val) => !isNaN(val)),
        );

        const typeKey = type as keyof typeof WITHDRAWAL_PREFIXES;
        const currentValue = chartEntry[typeKey] ?? 0;
        if (maxValue > currentValue) chartEntry[typeKey] = maxValue;
      }
    },
  );

  return Array.from(chartMap.values());
};

const buildChartKey = (date: Date, filter: "days" | "months" | "years") => {
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = date.getUTCFullYear().toString().slice(-2);

  if (filter === "days") return `${day}/${month}/${year}`;
  if (filter === "years") return `${year}`;
  return `${month}/${year}`;
};

const calculateLinearTicks = (
  lowerRange: number,
  upperRange: number,
  uniqueValues: number[],
): number[] => {
  if (uniqueValues.length === 0) return [0];
  if (uniqueValues.length === 1) return [uniqueValues[0]!];

  return [
    ...new Set(
      Array.from({ length: 11 }, (_, i) =>
        Math.round(lowerRange + (i * (upperRange - lowerRange)) / 10),
      ),
    ),
  ].sort((a, b) => a - b);
};

const calculateEthTicks = (
  lowerRange: number,
  upperRange: number,
  uniqueValues: number[],
): number[] => {
  if (uniqueValues.length === 0) return [0];
  if (uniqueValues.length === 1) return [uniqueValues[0]!];

  const range = upperRange - lowerRange;
  const isLargeRange = range > 1000;
  const step = range / 10;

  return [
    ...new Set(
      Array.from({ length: 11 }, (_, i) => {
        if (i === 0)
          return isLargeRange
            ? Math.trunc(lowerRange)
            : Math.trunc(lowerRange * 10000) / 10000;

        if (i === 10)
          return isLargeRange
            ? Math.trunc(upperRange)
            : Math.trunc(upperRange * 10000) / 10000;

        const value = lowerRange + step * i;
        return isLargeRange
          ? Number(value.toFixed(0))
          : Number(value.toFixed(4));
      }),
    ),
  ].sort((a, b) => a - b);
};

export const buildYAxis = (
  chartData: IChartData[],
  label: string,
  showLabel: boolean,
  orientation: "left" | "right",
  key: keyof Pick<
    IGroupedValidatorStatistics[string][number],
    "count" | "totalStaked" | "avgStaked"
  >,
): IYAxis => {
  const values = chartData.flatMap((item) =>
    [item.pectra, item.merge, item.shapella].filter(
      (val): val is number => val !== undefined,
    ),
  );

  const lowerRange = values.length > 0 ? Math.min(...values) : 0;
  const upperRange = values.length > 0 ? Math.max(...values) : 0;
  const uniqueValues = [...new Set(values)].sort((a, b) => a - b);

  const ticks =
    key === "count"
      ? calculateLinearTicks(lowerRange, upperRange, uniqueValues)
      : calculateEthTicks(lowerRange, upperRange, uniqueValues);

  return { lowerRange, upperRange, ticks, label, showLabel, orientation };
};

export const buildXAxis = (filter: "days" | "months" | "years"): IXAxis => {
  return {
    label: filter === "days" ? "Day" : filter === "months" ? "Month" : "Year",
    showLabel: false,
    orientation: "bottom",
  };
};
