import type { IChart, IGroupedValidatorStatistics } from "pec/types/chart";
import { buildChartData, buildXAxis, buildYAxis } from ".";

export const constructNumberOfValidatorsForEachUpgradeChartData = (
  groupedValidatorStatistics: IGroupedValidatorStatistics,
): IChart => {
  const chartData = buildChartData(groupedValidatorStatistics, "count");
  const yAxis = buildYAxis(chartData, "Number of validators", true, "left");
  const xAxis = buildXAxis();
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
