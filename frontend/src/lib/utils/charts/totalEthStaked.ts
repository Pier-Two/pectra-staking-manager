import type { IChart, IGroupedValidatorStatistics } from "pec/types/chart";
import { buildChartData, buildXAxis, buildYAxis } from ".";

export const constructTotalEthStakedChartData = (
  groupedValidatorStatistics: IGroupedValidatorStatistics,
  filter: "days" | "months" | "years",
): IChart => {
  const chartData = buildChartData(
    groupedValidatorStatistics,
    "totalStaked",
    filter,
  );
  const yAxis = buildYAxis(
    chartData,
    "Total ETH Staked",
    false,
    "left",
    "totalStaked",
  );
  const xAxis = buildXAxis(filter);

  return {
    type: "area",
    title: "Total ETH Staked",
    chartData,
    yAxis,
    xAxis,
    legend: true,
    footer: `An overview of how much ETH is staked for each upgrade.`,
  };
};
