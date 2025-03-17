"use client";

import type { FC } from "react";
import type { ISelectSourceValidators } from "pec/types/consolidation";
import { ValidatorCard } from "pec/components/validators/ValidatorCard";
import { DestinationValidatorDetails } from "./DestinationValidatorDetails";
import { Button } from "pec/components/ui/button";
import type { ValidatorDetails } from "pec/types/validator";
import { ValidatorList } from "./ValidatorList";

export const SelectSourceValidators: FC<ISelectSourceValidators> = (props) => {
  const {
    destinationValidator,
    selectedSourceTotal,
    setProgress,
    setSelectedDestinationValidator,
    selectedSourceValidators,
    setSelectedSourceValidators,
    validators,
  } = props;

  const availableSourceValidators = validators.filter(
    (validator) =>
      validator.validatorIndex !== destinationValidator.validatorIndex,
  );

  const handleResetDestinationValidator = () => {
    setSelectedDestinationValidator(null);
    setProgress(1);
  };

  const handleConsolidationProgression = () => {
    if (selectedSourceValidators.length > 0) setProgress(3);
  };

  const handleSourceValidatorSelection = (validator: ValidatorDetails) => {
    if (selectedSourceValidators.includes(validator))
      setSelectedSourceValidators(
        selectedSourceValidators.filter((v) => v !== validator),
      );
    else setSelectedSourceValidators([...selectedSourceValidators, validator]);
  };

  return (
    <div className="space-y-8">
      <div className="text-3xl">Select Source Validator(s)</div>
      <div className="text-md text-gray-700 dark:text-gray-300">
        All source validator balances will be consolidated into the elected
        destination validator.
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="text-lg font-medium">Destination validator</div>

          <div className="flex items-center justify-center">
            <ValidatorCard
              onClick={() => handleResetDestinationValidator()}
              validator={destinationValidator}
            />
          </div>
        </div>

        <DestinationValidatorDetails
          validator={destinationValidator}
          selectedSourceTotal={selectedSourceTotal}
        />

        <Button
          className="w-full space-x-2 rounded-xl border border-gray-800 bg-black p-4 hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-200"
          disabled={selectedSourceValidators.length === 0}
          onClick={() => handleConsolidationProgression()}
        >
          <div className="text-sm text-white dark:text-black">Next</div>
        </Button>
      </div>

      <div className="text-lg font-medium">Select all source validators</div>

      <ValidatorList
        setLocalSourceValidators={handleSourceValidatorSelection}
        validators={availableSourceValidators}
      />
    </div>
  );
};
