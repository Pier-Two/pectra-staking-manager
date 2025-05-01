import { groupBy } from "lodash";

import type { ValidatorSummary } from "pec/lib/database/classes/validatorSummary";
import type {
  IChart,
  IGroupedValidatorStatistics,
  ValidatorStatistics,
} from "pec/types/chart";
import { ValidatorSummaryModel } from "pec/lib/database/models";
import { constructAverageEthStakedChartData } from "pec/lib/utils/charts/averageEthStaked";
import { constructNumberOfValidatorsForEachUpgradeChartData } from "pec/lib/utils/charts/numberOfValidatorsForEachUpgrade";
import { constructTotalEthStakedChartData } from "pec/lib/utils/charts/totalEthStaked";
import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";

import { redisCacheMiddleware } from "../middleware/redis-cache-middleware";

export const chartRouter = createTRPCRouter({
  getChartData: publicProcedure
    .use(redisCacheMiddleware({ ttl: 21600, staleTime: 18000 })) // ttl 6 hours, stale time 5 hours
    .query(async () => {
      const validatorStatistics =
        await ValidatorSummaryModel.find<ValidatorStatistics>({
          timestamp: { $exists: true },
        })
          .select(
            "avgStaked count totalStaked withdrawalCredentialPrefix timestamp",
          )
          .lean();

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

      return [
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
    }),
});

const getValidatorGroups = (validatorStatistics: ValidatorSummary[]) => {
  const groupedValidators = groupBy(validatorStatistics, "timestamp");
  const pectraValidators = validatorStatistics.filter(
    (validator) => validator.withdrawalCredentialPrefix === "0x02",
  );
  const groupedPectraValidators = groupBy(pectraValidators, "timestamp");

  return {
    groupedValidators,
    groupedPectraValidators,
  };
};

const constructChartData = (
  groupedValidators: IGroupedValidatorStatistics,
  pectraValidators: IGroupedValidatorStatistics,
  filter: "days" | "months" | "years",
): IChart[] => {
  const numberOfValidatorsForEachUpgradeChartData =
    constructNumberOfValidatorsForEachUpgradeChartData(
      groupedValidators,
      filter,
    );
  const totalETHStakedForEachUpgradeChartData =
    constructTotalEthStakedChartData(groupedValidators, filter);
  const averageETHStakedPerValidatorForEachUpgradeChartData =
    constructAverageEthStakedChartData(pectraValidators, filter);

  return [
    numberOfValidatorsForEachUpgradeChartData,
    totalETHStakedForEachUpgradeChartData,
    averageETHStakedPerValidatorForEachUpgradeChartData,
  ];
};
