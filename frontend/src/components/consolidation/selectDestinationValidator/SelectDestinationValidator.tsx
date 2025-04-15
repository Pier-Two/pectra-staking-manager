"use client";

import { Button } from "pec/components/ui/button";
import { ValidatorList } from "./ValidatorList";
import { useConsolidationStore } from "pec/hooks/use-consolidation-store";
import { ManuallyEnterValidator } from "./ManuallyEnterValidator";

export const SelectDestinationValidator = () => {
  const {
    manuallySettingValidator,
    setManuallySettingValidator,
    setConsolidationTarget,
  } = useConsolidationStore();

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="text-2xl font-medium">Destination Validator</div>
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Your destination validator will receive all staked ETH from source
          validators and be updated to the new Pectra standard (0x02).
        </div>

        <div className="text-sm text-gray-700 dark:text-gray-300">
          To consolidate a single validator, select it as both the destination
          and the source validator.
        </div>
      </div>

      <div className="flex flex-row justify-between">
        <div className="text-md font-medium">Select destination validator</div>

        <Button
          onClick={() => {
            setConsolidationTarget(undefined); // perhaps unnecessary
            setManuallySettingValidator(!manuallySettingValidator);
          }}
        >
          {manuallySettingValidator
            ? "Select from your Validators"
            : "Enter Destination Validator Address"}
        </Button>
      </div>

      <div className="w-full">
        {manuallySettingValidator ? (
          <ManuallyEnterValidator />
        ) : (
          <ValidatorList />
        )}
      </div>
    </div>
  );
};
