import type { IChart, IGroupedValidatorStatistics } from "pec/types/chart";
import { buildChartData, buildXAxis, buildYAxis } from ".";

export const constructAverageEthStakedChartData = (
  groupedPectraValidators: IGroupedValidatorStatistics,
): IChart => {
  const chartData = buildChartData(groupedPectraValidators, "avgStaked");
  const yAxis = buildYAxis(chartData, "Average ETH Staked", true, "left");
  const xAxis = buildXAxis();

  return {
    title: "Average ETH Staked",
    chartData,
    yAxis,
    xAxis,
    legend: true,
    footer: `An overview of how much ETH is staked for each upgrade on average.`,
  };
};
