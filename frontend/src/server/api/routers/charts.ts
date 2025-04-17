import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import { ValidatorSummaryModel } from "pec/lib/database/models";
import { groupBy } from "lodash";
import type {
  IGroupedValidatorStatistics,
  IChart,
  ValidatorStatistics,
} from "pec/types/chart";
import type { ValidatorSummary } from "pec/lib/database/classes/validatorSummary";
import { constructNumberOfValidatorsForEachUpgradeChartData } from "pec/lib/utils/charts/numberOfValidatorsForEachUpgrade";
import { constructTotalEthStakedChartData } from "pec/lib/utils/charts/totalEthStaked";
import { constructAverageEthStakedChartData } from "pec/lib/utils/charts/averageEthStaked";

export const chartRouter = createTRPCRouter({
  getChartData: publicProcedure.query(async () => {
    console.time("getChartData");

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

    const response = [
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

    console.timeEnd("getChartData");

    return response;
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
