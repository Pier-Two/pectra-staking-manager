"use client";

import type { FC } from "react";
import type { IDestinationValidatorList } from "pec/types/consolidation";
import { ValidatorCard } from "pec/components/validators/cards/ValidatorCard";
import type { ValidatorDetails } from "pec/types/validator";

export const ValidatorList: FC<IDestinationValidatorList> = (props) => {
  const { setSelectedValidator, setProgress, validators } = props;

  const handleValidatorClick = (validator: ValidatorDetails) => {
    setSelectedValidator(validator);
    setProgress(2);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex-col-3 flex w-full justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Validator
          </div>
        </div>

        <div className="text-sm text-gray-700 dark:text-gray-300">
          Credential
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Balance
          </div>
        </div>
      </div>

      {validators.map((validator, index) => (
        <ValidatorCard
          key={`validator-${validator.validatorIndex}-${index}`}
          hasBackground={true}
          hasHover={true}
          onClick={() => handleValidatorClick(validator)}
          shrink={false}
          validator={validator}
        />
      ))}
    </div>
  );
};
