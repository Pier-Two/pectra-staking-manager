import type { FC } from "react";
import { ValidatorList } from "./ValidatorList";
import type { ISelectDestinationValidator } from "pec/types/consolidation";

export const SelectDestinationValidator: FC<ISelectDestinationValidator> = (
  props,
) => {
  const { setProgress, setSelectedDestinationValidator, validators } = props;
  return (
    <div className="space-y-8">
      <div className="text-3xl">Select a Destination Validator</div>
      <div className="text-md">
        Your destination validator will receive all staked ETH from source
        validators and be updated to the new Pectra standard (0x02).
      </div>

      <div className="text-md">
        To consolidate a single validator, select it as both the destination and
        the source validator.
      </div>

      <ValidatorList
        setProgress={setProgress}
        setSelectedValidator={setSelectedDestinationValidator}
        validators={validators}
      />
    </div>
  );
};
