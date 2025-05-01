import { groupBy } from "lodash";

import { TYPE_2_PREFIX } from "pec/constants/pectra";
import { validatorIsActive } from "pec/lib/utils/validators/status";
import { groupValidatorsByWithdrawalPrefix } from "pec/lib/utils/validators/withdrawalAddress";
import { api } from "pec/trpc/server";
import { ValidatorStatus } from "pec/types/validator";

export const getValidators = async (address: string, chainId: number) => {
  const validators = await api.validators.getValidators({
    address,
    chainId,
  });

  const groupedValidators = groupBy(validators, (validator) => {
    if (validatorIsActive(validator)) return ValidatorStatus.ACTIVE;

    return validator.status;
  });

  const activeType2Validators =
    groupValidatorsByWithdrawalPrefix(
      groupedValidators[ValidatorStatus.ACTIVE] ?? [],
    )[TYPE_2_PREFIX] ?? [];

  return {
    validators,
    groupedValidators,
    activeType2Validators,
  };
};
