import type {
  IChart,
  IChartData,
  IGroupedValidatorStatistics,
} from "pec/types/chart";
import { buildChartData, buildXAxis, buildYAxis } from ".";

export const constructNumberOfValidatorsForEachUpgradeChartData = (
  groupedValidatorStatistics: IGroupedValidatorStatistics,
  filter: "days" | "months" | "years",
): IChart => {
  const chartData = buildChartData(groupedValidatorStatistics, "count", filter);
  const yAxis = buildYAxis(chartData, "Number of validators", false, "left");
  const xAxis = buildXAxis(filter);
  const percentageUptake = getPercentageUptake(chartData);

  return {
    title: "Pectra adoption across all validators",
    chartData,
    yAxis,
    xAxis,
    legend: true,
    footer: `Since Pectra launched ${percentageUptake}% of validators have adopted the Type 2 standard.`,
  };
};

const getPercentageUptake = (chartData: IChartData[]) => {
  const latestData = chartData.slice(-1)[0];
  if (!latestData) return "0";
  const pectraValidators = latestData.pectra ?? 0;
  const totalValidators =
    (latestData.pectra ?? 0) +
    (latestData.shapella ?? 0) +
    (latestData.merge ?? 0);

  const percentage = (pectraValidators / totalValidators) * 100;
  return percentage.toFixed(getDecimalPrecision(percentage));
};

const getDecimalPrecision = (percentage: number) => {
  // If percentage is very small (less than 0.01), find the first non-zero decimal place
  if (percentage > 0 && percentage < 0.01) {
    let precision = 2;
    let tempValue = percentage;
    while (tempValue < 0.01) {
      precision++;
      tempValue *= 10;
    }
    return precision;
  }

  return 2;
};
