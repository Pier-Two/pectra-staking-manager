import { ValidatorSummaryModel } from "pec/server/database/models";
import type { ValidatorStatistics } from "pec/types/chart";
import { constructChartData } from "./constructChartData";
import { getValidatorGroups } from "./getValidatorGroups";
import { redis } from "pec/lib/utils/redis";

/**
 * Generates the chart data for the validators.
 *
 * Saves the data to the custom redis cache.
 * Is called every 6 hours by the mongodb trigger cron job, and
 * also called by the getChartData api procedure if the cache is empty.
 *
 * @returns The chart data
 */
export const generateChartData = async () => {
  const validatorStatistics =
    await ValidatorSummaryModel.find<ValidatorStatistics>({
      timestamp: { $exists: true },
    })
      .select(
        "avgStaked count totalStaked withdrawalCredentialPrefix timestamp",
      )
      .lean()
      .sort({ timestamp: 1 });

  if (!validatorStatistics || validatorStatistics.length === 0) return [];

  const { groupedValidators, groupedPectraValidators } =
    getValidatorGroups(validatorStatistics);

  if (
    !groupedValidators ||
    Object.keys(groupedValidators).length === 0 ||
    !groupedPectraValidators ||
    Object.keys(groupedPectraValidators).length === 0
  )
    return [];

  const chartData = constructChartData(
    groupedValidators,
    groupedPectraValidators,
    "days",
  );

  await redis.set("pectra-cache:chart-data-v1.3", JSON.stringify(chartData), {
    ex: 60 * 60, // 1 hour
  });

  return chartData;
};
