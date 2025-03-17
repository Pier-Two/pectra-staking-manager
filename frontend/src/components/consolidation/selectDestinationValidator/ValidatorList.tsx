"use client";

import type { FC } from "react";
import type { IDestinationValidatorList } from "pec/types/consolidation";
import { ChevronsUpDown } from "lucide-react";
import { ValidatorCard } from "pec/components/validators/ValidatorCard";
import type { ValidatorDetails } from "pec/types/validator";

export const ValidatorList: FC<IDestinationValidatorList> = (props) => {
  const { setSelectedValidator, setProgress, validators } = props;

  const handleValidatorClick = (validator: ValidatorDetails) => {
    setSelectedValidator(validator);
    setProgress(2);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex-col-3 flex w-full justify-between pe-4 ps-4">
        <div className="flex items-center gap-2">
          <div className="text-md text-gray-700 dark:text-gray-300">
            Validator
          </div>
          <ChevronsUpDown className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </div>

        <div className="text-md text-gray-700 dark:text-gray-300">
          Credential
        </div>

        <div className="flex items-center gap-2">
          <div className="text-md text-gray-700 dark:text-gray-300">
            Balance
          </div>
          <ChevronsUpDown className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </div>
      </div>

      {validators.map((validator, index) => (
        <ValidatorCard
          key={`validator-${validator.validatorIndex}-${index}`}
          onClick={() => handleValidatorClick(validator)}
          shrink={false}
          validator={validator}
        />
      ))}
    </div>
  );
};
