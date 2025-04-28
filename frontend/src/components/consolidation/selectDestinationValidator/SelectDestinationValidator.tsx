import { ManuallyEnterValidator } from "./ManuallyEnterValidator";
import { SecondaryButton } from "pec/components/ui/custom/SecondaryButton";
import { ValidatorTable } from "pec/components/ui/table/ValidatorTable";
import { CONSOLIDATION_TABLE_HEADERS } from "pec/constants/columnHeaders";
import { ValidatorDetails } from "pec/types/validator";
import { useState } from "react";

interface SelectDestinationValidatorProps {
  validators: ValidatorDetails[];
  goToSelectSourceValidators: (validator: ValidatorDetails) => void;
}

export const SelectDestinationValidator = ({
  validators,
  goToSelectSourceValidators,
}: SelectDestinationValidatorProps) => {
  const [manuallySettingValidator, setManuallySettingValidator] =
    useState(false);

  return (
    <div className="space-y-6">
      <div className="text-2xl font-medium">Destination Validator</div>
      <div className="text-base">
        Your destination validator will receive all staked ETH from source
        validators and be updated to the new Pectra standard (0x02).
      </div>

      <div className="text-base">
        To consolidate a single validator, select it as both the destination and
        the source validator.
      </div>

      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-md font-medium">Select destination validator</div>

        <SecondaryButton
          onClick={() => {
            setManuallySettingValidator(!manuallySettingValidator);
          }}
          label={
            manuallySettingValidator
              ? "Select from your Validators"
              : "Enter Destination Validator Address"
          }
        />
      </div>
      {manuallySettingValidator ? (
        <ManuallyEnterValidator />
      ) : (
        <ValidatorTable
          data={validators}
          headers={CONSOLIDATION_TABLE_HEADERS}
          selectableRows={{
            onClick: (row) => goToSelectSourceValidators(row),
            isSelected: () => false,
            showCheckIcons: false,
          }}
        />
      )}
    </div>
  );
};
