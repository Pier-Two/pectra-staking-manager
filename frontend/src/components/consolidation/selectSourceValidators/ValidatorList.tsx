"use client";

import { useConsolidationStore } from "pec/hooks/use-consolidation-store";
import type { ValidatorDetails } from "pec/types/validator";
import { type FC } from "react";
import { ValidatorCard } from "./ValidatorCard";
import { validatorIsActive } from "pec/lib/utils/validators/status";

export interface ISourceValidatorList {
  sourceValidators: ValidatorDetails[];
  setSourceValidators: (validator: ValidatorDetails) => void;
  validators: ValidatorDetails[];
}

export const ValidatorList: FC<ISourceValidatorList> = (props) => {
  const { validators } = props;

  const { validatorsToConsolidate, bulkSetConsolidationTargets } =
    useConsolidationStore();

  const handleValidatorClicked = (validator: ValidatorDetails) => {
    const isSelected = validatorsToConsolidate
      .map((item) => item.validatorIndex)
      .includes(validator.validatorIndex);

    if (isSelected) {
      const updatedValidators = validatorsToConsolidate.filter(
        (v) => v.validatorIndex !== validator.validatorIndex,
      );
      bulkSetConsolidationTargets(updatedValidators);
    } else {
      bulkSetConsolidationTargets([...validatorsToConsolidate, validator]);
    }
  };

  const activeValidators = validators?.filter((validator) =>
    validatorIsActive(validator),
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex-col-3 flex w-full justify-between pe-4 ps-4">
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Validator
          </div>
        </div>

        <div className="ms-14 text-sm text-gray-700 dark:text-gray-300">
          Credential
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Balance
          </div>
        </div>
      </div>

      {activeValidators.map((validator, index) => (
        <ValidatorCard
          checked={validatorsToConsolidate
            .map((item) => item.validatorIndex)
            .includes(validator.validatorIndex)}
          key={`validator-${validator.validatorIndex}-${index}`}
          onClick={() => handleValidatorClicked(validator)}
          validator={validator}
        />
      ))}
    </div>
  );
};
