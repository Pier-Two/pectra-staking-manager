import { WITHDRAWAL_PREFIXES } from "pec/constants/api";
import type {
  IChartData,
  IGroupedValidatorStatistics,
  IXAxis,
  IYAxis,
} from "pec/types/chart";
import { chain, mapValues, sumBy } from "lodash";
import { format } from "date-fns";

const convertGweiToEth = (value: number): number => value / 1e9;

/**
 * Builds chart data from grouped validator statistics.
 * This function processes validator data to create time-series chart data points,
 * grouping validators by their withdrawal credential type (merge, shapella, pectra)
 * and time period (days, months, years). For each time period, it uses the latest
 * value rather than the maximum value.
 *
 * @param groupedValidatorStatistics - Object containing validator statistics grouped by timestamp
 * @param key - The metric to chart ('count', 'totalStaked', or 'avgStaked')
 * @param filter - Time period grouping ('days', 'months', or 'years')
 * @returns Array of chart data points with values for each validator type
 * @throws Error if input data is invalid
 */
export const buildChartData = (
  groupedValidatorStatistics: IGroupedValidatorStatistics,
  key: keyof Pick<
    IGroupedValidatorStatistics[string][number],
    "count" | "totalStaked" | "avgStaked"
  >,
  filter: "days" | "months" | "years",
): IChartData[] => {
  if (
    !groupedValidatorStatistics ||
    typeof groupedValidatorStatistics !== "object"
  ) {
    throw new Error("Invalid validator statistics data");
  }

  // Convert the grouped statistics into an array of entries and sort by timestamp
  const sortedEntries = chain(groupedValidatorStatistics)
    .entries()
    .sortBy(([timestamp]) => new Date(timestamp).getTime())
    .value();

  // Process each timestamp group and create chart data
  return chain(sortedEntries)
    .map(([timestamp, group]) => {
      if (!Array.isArray(group) || group.length === 0) return null;

      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        console.warn(`Invalid timestamp: ${timestamp}`);
        return null;
      }

      const chartKey = buildChartKey(date, filter);

      // Process each validator type
      const typeValues = mapValues(WITHDRAWAL_PREFIXES, (prefix) => {
        const validatorsOfType = group.filter(
          (validator) => validator?.withdrawalCredentialPrefix === prefix,
        );

        if (validatorsOfType.length === 0) return 0;

        return sumBy(validatorsOfType, (validator) => {
          const value = Number(validator[key] || 0);
          return key === "count" ? value : convertGweiToEth(value);
        });
      });

      return {
        key: chartKey,
        ...typeValues,
      };
    })
    .compact()
    .value();
};

/**
 * Builds a chart key based on the date and filter type.
 * Uses date-fns for consistent and reliable date formatting.
 *
 * @param date - The date to format
 * @param filter - The time period grouping ('days', 'months', or 'years')
 * @returns Formatted date string based on the filter type
 */
const buildChartKey = (date: Date, filter: "days" | "months" | "years") => {
  switch (filter) {
    case "days":
      return format(date, "dd/MM/yy");
    case "years":
      return format(date, "yy");
    case "months":
      return format(date, "MM/yy");
  }
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
  width: number,
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

  return {
    lowerRange,
    upperRange,
    ticks,
    label,
    showLabel,
    orientation,
    width,
  };
};

export const buildXAxis = (filter: "days" | "months" | "years"): IXAxis => {
  return {
    label: filter === "days" ? "Day" : filter === "months" ? "Month" : "Year",
    showLabel: false,
    orientation: "bottom",
  };
};
