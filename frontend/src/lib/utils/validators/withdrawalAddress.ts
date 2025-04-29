import { groupBy } from "lodash";
import {
  ValidatorDetails,
  WithdrawalAddressPrefixType,
} from "pec/types/validator";

export const groupValidatorsByWithdrawalPrefix = (
  validators: ValidatorDetails[],
): Partial<Record<WithdrawalAddressPrefixType, ValidatorDetails[]>> => {
  return groupBy(validators, (validator) =>
    validator.withdrawalAddress.slice(0, 4),
  );
};
