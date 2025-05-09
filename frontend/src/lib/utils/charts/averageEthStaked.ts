import type {
  IChart,
  IChartData,
  IGroupedValidatorStatistics,
} from "pec/types/chart";
import { buildChartKey, buildXAxis, buildYAxis, convertGweiToEth } from ".";
import _ from "lodash";

const buildAverageChartData = (
  groupedValidatorStatistics: IGroupedValidatorStatistics,
  filter: "days" | "months" | "years",
): IChartData[] => {
  const averageChartData: IChartData[] = [];

  Object.entries(groupedValidatorStatistics).forEach(
    ([timestampKey, group]) => {
      const chartKey = buildChartKey(new Date(timestampKey), filter);

      let totalValidators = 0;
      let totalAvgStaked = 0;
      for (const validatorStatus of group) {
        const validatorCount = Number(validatorStatus.count || 0);
        const validatorAvgStaked = Number(validatorStatus.avgStaked || 0);

        totalValidators += validatorCount;
        totalAvgStaked += validatorAvgStaked * validatorCount;
      }

      averageChartData.push({
        key: chartKey,
        avgEthStaked: convertGweiToEth(totalAvgStaked / totalValidators),
        totalValidatorCount: totalValidators,
      });
    },
  );

  return averageChartData;
};

export const constructAverageEthStakedChartData = (
  groupedValidators: IGroupedValidatorStatistics,
  filter: "days" | "months" | "years",
): IChart => {
  const combinedArray = buildAverageChartData(groupedValidators, filter);

  const yAxis = buildYAxis(
    combinedArray,
    "Average ETH Staked",
    false,
    "left",
    "avgStaked",
    30,
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
