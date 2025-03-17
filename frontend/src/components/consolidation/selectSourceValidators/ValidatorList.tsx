"use client";

import type { FC } from "react";
import type { ISourceValidatorList } from "pec/types/consolidation";
import { ChevronsUpDown } from "lucide-react";
import { ValidatorCard } from "./ValidatorCard";

export const ValidatorList: FC<ISourceValidatorList> = (props) => {
  const { sourceValidators, setSourceValidators, validators } = props;

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
          checked={sourceValidators.includes(validator)}
          key={`validator-${validator.validatorIndex}-${index}`}
          onClick={() => setSourceValidators(validator)}
          validator={validator}
        />
      ))}
    </div>
  );
};
