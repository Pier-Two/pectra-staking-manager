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

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-md font-medium">
            Select destination validator
          </div>
          <TabsList>
            <TabsTrigger value="validators">Select from Validators</TabsTrigger>
            <TabsTrigger value="manually">Enter Address</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="validators" asChild>
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
        <TabsContent value="manually" asChild>
          <ManuallyEnterValidator
            goToSelectSourceValidators={goToSelectSourceValidators}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
