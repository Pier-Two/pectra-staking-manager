import { Pencil, Zap } from "lucide-react";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { SecondaryButton } from "pec/components/ui/custom/SecondaryButton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "pec/components/ui/tabs";
import { ValidatorCard } from "pec/components/validators/cards/ValidatorCard";
import { DetectedValidators } from "pec/components/validators/DetectedValidators";
import { EIconPosition } from "pec/types/components";
import { type ValidatorDetails } from "pec/types/validator";
import { useMemo } from "react";
import { displayedEthAmount } from "pec/lib/utils/validators/balance";
import { ValidatorTable } from "pec/components/ui/table/ValidatorTable";
import { CONSOLIDATION_TABLE_HEADERS } from "pec/constants/columnHeaders";
import { DisplayAmount } from "pec/components/ui/table/TableComponents";

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
  const isValidatorSelected = (validator: ValidatorDetails) => {
    return sourceValidators.some((v) => v.publicKey === validator.publicKey);
  };

  const newDestinationBalance = useMemo(() => {
    return (
      sourceValidators.reduce((acc, validator) => {
        return acc + validator.balance;
      }, 0) + (destinationValidator.balance ?? 0)
    );
  }, [sourceValidators, destinationValidator]);

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <div className="text-2xl font-medium">Source Validator(s)</div>
        <div className="text-base text-gray-700 dark:text-gray-300">
          All source validator balances will be consolidated into the elected
          destination validator.
        </div>
      </div>

      <div className="space-y-8">
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
      </div>

      <div className="text-md font-medium">Select source validator(s)</div>

      <Tabs defaultValue="maxConsolidate" className="w-full space-y-8">
        <TabsList className="text-piertwoDark-text grid w-full grid-cols-2 rounded-md bg-indigo-800 bg-opacity-10 dark:bg-gray-800">
          <TabsListItem
            value="maxConsolidate"
            onClick={() => setSourceValidators(availableSourceValidators)}
          >
            Max consolidate
          </TabsListItem>

          <TabsListItem
            value="manuallySelect"
            onClick={() => setSourceValidators([])}
          >
            Manually select
          </TabsListItem>
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
          />
        </TabsContent>
      </Tabs>

      <div className="flex flex-row items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <Zap className="h-4 w-4 fill-indigo-500 text-indigo-500" />
        <div>New destination balance:</div>
        <DisplayAmount
          amount={newDestinationBalance}
          opts={{ decimals: 2, hidePostfixSymbol: true }}
        />
        {"/"}
        <DisplayAmount
          amount={2048}
          opts={{ decimals: 0, hidePostfixSymbol: true }}
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
  onClick: () => void;
  value: string;
  children: React.ReactNode;
}

const TabsListItem = ({ onClick, value, children }: TabsListItemProps) => {
  return (
    <TabsTrigger
      className="text-piertwo-text data-[state=active]:text-piertwoDark-text rounded-md font-semibold data-[state=active]:bg-white data-[state=active]:dark:bg-black"
      value={value}
      onClick={onClick}
    >
      {children}
    </TabsTrigger>
  );
};
