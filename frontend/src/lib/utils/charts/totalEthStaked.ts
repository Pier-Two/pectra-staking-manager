import type { IChart, IGroupedValidatorStatistics } from "pec/types/chart";
import { buildChartData, buildXAxis, buildYAxis } from ".";

export const constructTotalEthStakedChartData = (
  groupedValidatorStatistics: IGroupedValidatorStatistics,
): IChart => {
  const chartData = buildChartData(groupedValidatorStatistics, "totalStaked");
  const yAxis = buildYAxis(chartData, "Total ETH Staked", true, "left");
  const xAxis = buildXAxis();

  return {
    title: "Total ETH Staked",
    chartData,
    yAxis,
    xAxis,
    legend: true,
    footer: `An overview of how much ETH is staked for each upgrade.`,
  };
};
