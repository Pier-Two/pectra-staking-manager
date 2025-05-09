import { constructAverageEthStakedChartData } from "pec/lib/utils/charts/averageEthStaked";
import { constructNumberOfValidatorsForEachUpgradeChartData } from "pec/lib/utils/charts/numberOfValidatorsForEachUpgrade";
import { constructTotalEthStakedChartData } from "pec/lib/utils/charts/totalEthStaked";
import type { IGroupedValidatorStatistics, IChart } from "pec/types/chart";

export const constructChartData = (
  groupedValidators: IGroupedValidatorStatistics,
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
    constructAverageEthStakedChartData(groupedValidators, filter);

  return [
    averageETHStakedPerValidatorForEachUpgradeChartData,
    numberOfValidatorsForEachUpgradeChartData,
    totalETHStakedForEachUpgradeChartData,
  ];
};
