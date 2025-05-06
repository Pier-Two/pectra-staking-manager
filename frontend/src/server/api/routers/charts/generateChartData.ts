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

  const chartData = [
    {
      key: "days",
      data: constructChartData(
        groupedValidators,
        groupedPectraValidators,
        "days",
      ),
    },
    {
      key: "months",
      data: constructChartData(
        groupedValidators,
        groupedPectraValidators,
        "months",
      ),
    },
    {
      key: "years",
      data: constructChartData(
        groupedValidators,
        groupedPectraValidators,
        "years",
      ),
    },
  ];

  await redis.set("pectra-cache:chart-data", JSON.stringify(chartData), {
    ex: 60 * 60 * 6, // 6 hours
  });

  return chartData;
};
