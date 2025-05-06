import { groupBy } from "lodash";
import type { ValidatorSummary } from "pec/server/database/classes/validatorSummary";

export const getValidatorGroups = (validatorStatistics: ValidatorSummary[]) => {
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
