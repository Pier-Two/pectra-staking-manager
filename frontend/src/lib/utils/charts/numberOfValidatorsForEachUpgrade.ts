import type { IChart, IGroupedValidatorStatistics } from "pec/types/chart";
import { buildChartData, buildXAxis, buildYAxis } from ".";

export const constructNumberOfValidatorsForEachUpgradeChartData = (
  groupedValidatorStatistics: IGroupedValidatorStatistics,
  filter: "days" | "months" | "years",
): IChart => {
  const chartData = buildChartData(groupedValidatorStatistics, "count", filter);
  const yAxis = buildYAxis(chartData, "Number of validators", false, "left");
  const xAxis = buildXAxis(filter);
  const percentageUptake = "";

  return {
    title: "Pectra adoption across all validators",
    chartData,
    yAxis,
    xAxis,
    legend: true,
    footer: `Since Pectra launched ${percentageUptake}% of validators have adopted th Type 2 standard.`,
  };
};
