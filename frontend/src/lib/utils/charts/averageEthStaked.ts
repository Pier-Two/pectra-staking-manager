import type { IChart, IGroupedValidatorStatistics } from "pec/types/chart";
import { buildChartData, buildXAxis, buildYAxis } from ".";

export const constructAverageEthStakedChartData = (
  groupedPectraValidators: IGroupedValidatorStatistics,
  filter: "days" | "months" | "years",
): IChart => {
  const chartData = buildChartData(
    groupedPectraValidators,
    "avgStaked",
    filter,
  );
  const yAxis = buildYAxis(chartData, "Average ETH Staked", false, "left");
  const xAxis = buildXAxis(filter);

  return {
    title: "Average ETH Staked",
    chartData,
    yAxis,
    xAxis,
    legend: true,
    footer: `An overview of how much ETH is staked for each upgrade on average.`,
  };
};
