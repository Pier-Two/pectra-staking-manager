import type { FC } from "react";
import { ValidatorList } from "./ValidatorList";
import type { ISelectDestinationValidator } from "pec/types/consolidation";

export const SelectDestinationValidator: FC<ISelectDestinationValidator> = (
  props,
) => {
  const { setProgress, setSelectedDestinationValidator, validators } = props;
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="text-3xl">Destination Validator</div>
        <div className="text-md text-gray-700 dark:text-gray-300">
          Your destination validator will receive all staked ETH from source
          validators and be updated to the new Pectra standard (0x02).
        </div>

        <div className="text-md text-gray-700 dark:text-gray-300">
          To consolidate a single validator, select it as both the destination
          and the source validator.
        </div>
      </div>

      <div className="text-md font-medium">
        Select destination validator
      </div>

      <ValidatorList
        setProgress={setProgress}
        setSelectedValidator={setSelectedDestinationValidator}
        validators={validators}
      />
    </div>
  );
};
