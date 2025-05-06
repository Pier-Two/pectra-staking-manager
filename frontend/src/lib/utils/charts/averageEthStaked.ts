import type {
  IChart,
  IChartData,
  IGroupedValidatorStatistics,
} from "pec/types/chart";
import { buildChartData, buildXAxis, buildYAxis } from ".";
import _ from "lodash";

export const constructAverageEthStakedChartData = (
  groupedPectraValidators: IGroupedValidatorStatistics,
  groupedValidators: IGroupedValidatorStatistics,
  filter: "days" | "months" | "years",
): IChart => {
  const chartData = buildChartData(
    groupedPectraValidators,
    "avgStaked",
    filter,
  );

  const totalValidatorCountData = buildChartData(
    groupedValidators,
    "count",
    filter,
  );

  const filteredChartData = filterChartDataForAverageStake(chartData);

  const filteredTotalValidatorCountData = filterChartDataForTotalValidatorCount(
    totalValidatorCountData,
  );

  // Combine both arrays
  const allData = [...filteredChartData, ...filteredTotalValidatorCountData];

  // Group by key and merge
  const combinedArray = _.chain(allData)
    .groupBy("key")
    .map((group) => _.mergeWith({}, ...group))
    .value();

  const yAxis = buildYAxis(
    combinedArray,
    "Average ETH Staked",
    false,
    "left",
    "avgStaked",
  );

  const xAxis = buildXAxis(filter);

  return {
    type: "line",
    title: "Average ETH Staked & Total Validator Count",
    chartData: combinedArray,
    yAxis,
    xAxis,
    legend: true,
    footer: `An overview of how much ETH is staked on average per Pectra validator and the total number of validators.`,
  };
};

const filterChartDataForAverageStake = (chartData: IChartData[]) => {
  return chartData.map((data) => ({
    key: data.key,
    avgEthStaked: data.pectra,
  }));
};

const filterChartDataForTotalValidatorCount = (chartData: IChartData[]) => {
  return chartData.map((data) => ({
    key: data.key,
    totalValidatorCount:
      (data.pectra ?? 0) + (data.merge ?? 0) + (data.shapella ?? 0),
  }));
};
