import type {
  IChart,
  IChartData,
  IGroupedValidatorStatistics,
} from "pec/types/chart";
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

  const filteredChartData = filterChartDataForAverageStake(chartData);

  const yAxis = buildYAxis(
    filteredChartData,
    "Average ETH Staked",
    false,
    "left",
    "avgStaked",
  );

  const xAxis = buildXAxis(filter);

  return {
    title: "Average ETH Staked",
    chartData: filteredChartData,
    yAxis,
    xAxis,
    legend: false,
    footer: `An overview of how much ETH is staked on average per validator for the Pectra upgrade.`,
  };
};

const filterChartDataForAverageStake = (chartData: IChartData[]) => {
  return chartData.map((data) => ({
    key: data.key,
    pectra: data.pectra,
  }));
};
