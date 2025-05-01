import { useMemo } from "react";
import { keyBy, sumBy } from "lodash";
import { Pencil, Zap } from "lucide-react";

import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { SecondaryButton } from "pec/components/ui/custom/SecondaryButton";
import { DisplayAmount } from "pec/components/ui/table/TableComponents";
import { ValidatorTable } from "pec/components/ui/table/ValidatorTable";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "pec/components/ui/tabs";
import { ValidatorCard } from "pec/components/validators/cards/ValidatorCard";
import { DetectedValidators } from "pec/components/validators/DetectedValidators";
import { CONSOLIDATION_TABLE_HEADERS } from "pec/constants/columnHeaders";
import { EIconPosition } from "pec/types/components";
import { type ValidatorDetails } from "pec/types/validator";

interface SelectSourceValidatorsProps {
  availableSourceValidators: ValidatorDetails[];
  sourceValidators: ValidatorDetails[];
  destinationValidator: ValidatorDetails;
  setSourceValidators: (
    validators: ValidatorDetails | ValidatorDetails[],
  ) => void;
  goToSummary: () => void;
  goBack: () => void;
}

export const SelectSourceValidators = ({
  sourceValidators,
  destinationValidator,
  setSourceValidators,
  availableSourceValidators,
  goToSummary,
  goBack,
}: SelectSourceValidatorsProps) => {
  const validatorSelectedRecord = keyBy(sourceValidators, (v) => v.publicKey);

  const isValidatorSelected = (validator: ValidatorDetails) => {
    return !!validatorSelectedRecord[validator.publicKey];
  };

  const newDestinationBalance = useMemo(() => {
    const sourceValidatorsSum = sumBy(sourceValidators, (v) => v.balance);
    return sourceValidatorsSum + destinationValidator.balance;
  }, [sourceValidators, destinationValidator]);

  return (
    <div className="w-full space-y-6">
      <div className="space-y-6">
        <div className="text-2xl font-medium">Source Validator(s)</div>
        <div className="text-base">
          All source validator balances will be consolidated into the elected
          destination validator.
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-md font-medium">Destination validator</div>

        <div className="flex flex-col items-center justify-center gap-4">
          <ValidatorCard validator={destinationValidator} />

          <SecondaryButton
            className="w-full"
            label="Change destination"
            icon={<Pencil className="h-4 w-4" />}
            iconPosition={EIconPosition.LEFT}
            onClick={goBack}
            disabled={false}
          />
        </div>
      </div>

      <div className="text-base font-medium">Select source validator(s)</div>

      <Tabs
        defaultValue={
          sourceValidators.length === 0 ||
          sourceValidators.length === availableSourceValidators.length
            ? "maxConsolidate"
            : "manuallySelect"
        }
        className="w-full space-y-8"
        onValueChange={(e) => {
          if (e === "maxConsolidate") {
            setSourceValidators(availableSourceValidators);
          } else {
            setSourceValidators([]);
          }
        }}
      >
        <TabsList className="grid w-full grid-cols-2 rounded-md bg-indigo-800 bg-opacity-10 text-piertwoDark-text dark:bg-gray-800">
          <TabsListItem value="maxConsolidate">Max consolidate</TabsListItem>

          <TabsListItem value="manuallySelect">Manually select</TabsListItem>
        </TabsList>

        <TabsContent value="maxConsolidate">
          <DetectedValidators
            cardTitle="selected"
            validators={sourceValidators}
          />
        </TabsContent>

        <TabsContent value="manuallySelect">
          <ValidatorTable
            data={availableSourceValidators}
            headers={CONSOLIDATION_TABLE_HEADERS}
            selectableRows={{
              onClick: setSourceValidators,
              isSelected: isValidatorSelected,
              showCheckIcons: true,
            }}
            disablePagination
          />
        </TabsContent>
      </Tabs>

      <div className="flex flex-row items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <Zap className="h-4 w-4 fill-indigo-500 text-indigo-500" />
        <div className="text-sm">New destination balance:</div>
        <DisplayAmount amount={newDestinationBalance} opts={{ decimals: 2 }} />
        {"/"}
        <DisplayAmount
          amount={2048}
          opts={{ decimals: 0 }}
          className="font-normal"
        />
        max
      </div>

      <PrimaryButton
        className="w-full"
        label="Next"
        onClick={goToSummary}
        disabled={sourceValidators.length === 0}
      />
    </div>
  );
};

interface TabsListItemProps {
  value: string;
  children: React.ReactNode;
}

const TabsListItem = ({ value, children }: TabsListItemProps) => {
  return (
    <TabsTrigger
      className="rounded-md font-semibold text-piertwo-text data-[state=active]:bg-white data-[state=active]:text-piertwoDark-text data-[state=active]:dark:bg-black"
      value={value}
    >
      {children}
    </TabsTrigger>
  );
};
