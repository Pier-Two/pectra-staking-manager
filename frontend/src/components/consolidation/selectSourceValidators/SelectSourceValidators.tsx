"use client";

import { useEffect, useMemo, useState, type FC } from "react";
import type { ISelectSourceValidators } from "pec/types/consolidation";
import { ValidatorCard } from "pec/components/validators/cards/ValidatorCard";
import type { ValidatorDetails } from "pec/types/validator";
import { ValidatorList } from "./ValidatorList";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { SecondaryButton } from "pec/components/ui/custom/SecondaryButton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "pec/components/ui/tabs";
import { DetectedValidators } from "pec/components/validators/DetectedValidators";
import { AlignLeft, Pencil, Zap } from "lucide-react";
import { EIconPosition } from "pec/types/components";
import { DECIMAL_PLACES } from "pec/lib/constants";

export const SelectSourceValidators: FC<ISelectSourceValidators> = (props) => {
  const {
    destinationValidator,
    setProgress,
    setSelectedDestinationValidator,
    selectedSourceValidators,
    setSelectedSourceValidators,
    validators,
  } = props;

  const [activeTab, setActiveTab] = useState<string>("maxConsolidate");

  const availableSourceValidators = useMemo(() => {
    return validators.filter(
      (validator) =>
        validator.validatorIndex !== destinationValidator.validatorIndex,
    );
  }, [validators, destinationValidator]);

  useEffect(() => {
    if (activeTab === "maxConsolidate")
      setSelectedSourceValidators(availableSourceValidators);

    if (activeTab === "manuallySelect") setSelectedSourceValidators([]);
  }, [activeTab, availableSourceValidators, setSelectedSourceValidators]);

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

  const newDestinationBalance = useMemo(() => {
    return (
      selectedSourceValidators.reduce((acc, validator) => {
        return acc + validator.balance;
      }, 0) + destinationValidator.balance
    );
  }, [selectedSourceValidators, destinationValidator]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="text-3xl">Source Validator(s)</div>
        <div className="text-md text-gray-700 dark:text-gray-300">
          All source validator balances will be consolidated into the elected
          destination validator.
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <div className="text-lg font-medium">Destination validator</div>

          <div className="flex flex-col items-center justify-center gap-4">
            <ValidatorCard
              hasBackground={true}
              hasHover={false}
              shrink={false}
              validator={destinationValidator}
            />

            <SecondaryButton
              className="w-full"
              label="Change destination"
              icon={<Pencil className="h-4 w-4" />}
              iconPosition={EIconPosition.LEFT}
              onClick={() => handleResetDestinationValidator()}
              disabled={false}
            />
          </div>
        </div>
      </div>

      <div className="text-lg font-medium">Select source validator(s)</div>

      <Tabs
        defaultValue="maxConsolidate"
        className="w-full space-y-8"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2 rounded-xl bg-gray-200 dark:bg-gray-900">
          <TabsTrigger
            className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:text-black"
            value="maxConsolidate"
          >
            Max consolidate
          </TabsTrigger>

          <TabsTrigger
            className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:text-black"
            value="manuallySelect"
          >
            Manually select
          </TabsTrigger>
        </TabsList>

        <TabsContent value="maxConsolidate">
          <DetectedValidators
            cardTitle="selected"
            validators={availableSourceValidators}
          />
        </TabsContent>

        <TabsContent value="manuallySelect">
          <ValidatorList
            sourceValidators={selectedSourceValidators}
            setSourceValidators={handleSourceValidatorSelection}
            validators={availableSourceValidators}
          />
        </TabsContent>
      </Tabs>

      <div className="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
        <Zap className="h-5 w-5 fill-indigo-500 text-indigo-500" />
        <div>New destination balance:</div>

        <div className="flex items-center gap-1 text-black dark:text-white">
          <AlignLeft className="h-3 w-3" />
          <span>{newDestinationBalance.toFixed(DECIMAL_PLACES)} /</span>
        </div>

        <div className="flex items-center gap-1">
          <AlignLeft className="h-3 w-3 text-gray-500" />
          <span>2,048 max</span>
        </div>
      </div>

      <PrimaryButton
        className="w-full"
        label="Next"
        onClick={() => handleConsolidationProgression()}
        disabled={selectedSourceValidators.length === 0}
      />
    </div>
  );
};
