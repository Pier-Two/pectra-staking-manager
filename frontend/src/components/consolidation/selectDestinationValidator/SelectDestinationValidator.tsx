import { ManuallyEnterValidator } from "./ManuallyEnterValidator";
import { ValidatorTable } from "pec/components/ui/table/ValidatorTable";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "pec/components/ui/tabs";
import { CONSOLIDATION_TABLE_HEADERS } from "pec/constants/columnHeaders";
import { type ValidatorDetails } from "pec/types/validator";
import { useState } from "react";

interface SelectDestinationValidatorProps {
  validators: ValidatorDetails[];
  goToSelectSourceValidators: (validator: ValidatorDetails) => void;
}

export const SelectDestinationValidator = ({
  validators,
  goToSelectSourceValidators,
}: SelectDestinationValidatorProps) => {
  const [selectedTab, setSelectedTab] = useState("validators");

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

      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="flex flex-col gap-6"
      >
        <div className="text-base font-medium">
          Select destination validator
        </div>

        <TabsList className="w-full">
          <TabsTrigger value="validators" className="flex-1">
            Select from Validators
          </TabsTrigger>
          <TabsTrigger value="manually" className="flex-1">
            Enter Address
          </TabsTrigger>
        </TabsList>

        <TabsContent value="validators">
          <ValidatorTable
            data={validators}
            headers={CONSOLIDATION_TABLE_HEADERS}
            selectableRows={{
              onClick: (row) => goToSelectSourceValidators(row),
              isSelected: () => false,
              showCheckIcons: false,
            }}
            disablePagination
          />
        </TabsContent>
        <TabsContent value="manually">
          <ManuallyEnterValidator
            goToSelectSourceValidators={goToSelectSourceValidators}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
