"use client";

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
import { useConsolidationStore } from "pec/hooks/use-consolidation-store";
import { useValidators } from "pec/hooks/useValidators";
import { EIconPosition } from "pec/types/components";
import { ValidatorStatus, type ValidatorDetails } from "pec/types/validator";
import { useEffect, useMemo, useState } from "react";
import { ValidatorList } from "./ValidatorList";
import { displayedEthAmount } from "pec/lib/utils/validators/balance";
import { ValidatorTable } from "pec/components/ui/table/ValidatorTable";
import { CONSOLIDATION_TABLE_HEADERS } from "pec/constants/consolildation";

export const SelectSourceValidators = () => {
  const {
    consolidationTarget,
    setConsolidationTarget,
    setProgress,
    bulkSetConsolidationTargets,
    validatorsToConsolidate,
    handleValidatorToConsolidateSelect,
  } = useConsolidationStore();

  const [activeTab, setActiveTab] = useState<string>("maxConsolidate");

  const { groupedValidators } = useValidators();

  const availableSourceValidators =
    groupedValidators[ValidatorStatus.ACTIVE] ?? [];

  useEffect(() => {
    if (
      activeTab === "maxConsolidate" &&
      validatorsToConsolidate?.length === 0
    ) {
      if (availableSourceValidators) {
        bulkSetConsolidationTargets(availableSourceValidators);
      }
    }
  }, [
    activeTab,
    availableSourceValidators,
    bulkSetConsolidationTargets,
    validatorsToConsolidate?.length,
  ]);

  const handleResetConsolidationTarget = () => {
    setConsolidationTarget(undefined);
    setProgress("destination");
  };

  const handleConsolidationProgression = () => {
    if (validatorsToConsolidate?.length > 0) setProgress("summary");
  };

  const isValidatorSelected = (validator: ValidatorDetails) => {
    return validatorsToConsolidate.some(
      (v) => v.publicKey === validator.publicKey,
    );
  };

  const newDestinationBalance = useMemo(() => {
    return (
      validatorsToConsolidate.reduce((acc, validator) => {
        return acc + validator.balance;
      }, 0n) + (consolidationTarget?.balance ?? 0n)
    );
  }, [validatorsToConsolidate, consolidationTarget]);

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <div className="text-2xl font-medium">Source Validator(s)</div>
        <div className="text-sm text-gray-700 dark:text-gray-300">
          All source validator balances will be consolidated into the elected
          destination validator.
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <div className="text-md font-medium">Destination validator</div>

          <div className="flex flex-col items-center justify-center gap-4">
            {consolidationTarget && (
              <ValidatorCard shrink={false} validator={consolidationTarget} />
            )}

            <SecondaryButton
              className="w-full"
              label="Change destination"
              icon={<Pencil className="h-4 w-4" />}
              iconPosition={EIconPosition.LEFT}
              onClick={() => handleResetConsolidationTarget()}
              disabled={false}
            />
          </div>
        </div>
      </div>

      <div className="text-md font-medium">Select source validator(s)</div>

      <Tabs
        defaultValue="maxConsolidate"
        className="w-full space-y-8"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2 rounded-xl bg-gray-200 dark:bg-gray-900">
          <TabsTrigger
            className="rounded-xl text-gray-800 data-[state=active]:bg-white data-[state=active]:text-indigo-800 dark:text-gray-200 dark:data-[state=active]:text-black"
            value="maxConsolidate"
            onClick={() =>
              bulkSetConsolidationTargets(availableSourceValidators ?? [])
            }
          >
            Max consolidate
          </TabsTrigger>

          <TabsTrigger
            className="rounded-xl text-gray-800 data-[state=active]:bg-white data-[state=active]:text-indigo-800 dark:text-gray-200 dark:data-[state=active]:text-black"
            value="manuallySelect"
            onClick={() => bulkSetConsolidationTargets([])}
          >
            Manually select
          </TabsTrigger>
        </TabsList>

        <TabsContent value="maxConsolidate">
          <DetectedValidators
            cardTitle="selected"
            validators={validatorsToConsolidate}
          />
        </TabsContent>

        <TabsContent value="manuallySelect">
          <ValidatorTable
            data={availableSourceValidators}
            headers={CONSOLIDATION_TABLE_HEADERS}
            selectableRows={{
              onClick: handleValidatorToConsolidateSelect,
              isSelected: isValidatorSelected,
              showCheckIcons: true,
            }}
          />
        </TabsContent>
      </Tabs>

      <div className="flex flex-row items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <Zap className="h-4 w-4 fill-indigo-500 text-indigo-500" />
        <div>New destination balance:</div>

        <div className="font-semibold">
          Ξ {displayedEthAmount(newDestinationBalance)}
        </div>

        <div className="flex items-center gap-1">
          <span>Ξ 2,048 max</span>
        </div>
      </div>

      <PrimaryButton
        className="w-full"
        label="Next"
        onClick={() => handleConsolidationProgression()}
        disabled={validatorsToConsolidate.length === 0}
      />
    </div>
  );
};
