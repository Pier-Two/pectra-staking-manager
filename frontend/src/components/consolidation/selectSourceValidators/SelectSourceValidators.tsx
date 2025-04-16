"use client";

import { AlignLeft, Pencil, Zap } from "lucide-react";
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
import { useWalletAddress } from "pec/hooks/useWallet";
import { DECIMAL_PLACES } from "pec/lib/constants";
import { api } from "pec/trpc/react";
import { EIconPosition } from "pec/types/components";
import type { ValidatorDetails } from "pec/types/validator";
import { useEffect, useMemo, useState } from "react";
import { formatEther } from "viem";
import { ValidatorList } from "./ValidatorList";

export const SelectSourceValidators = () => {
  const {
    consolidationTarget,
    setConsolidationTarget,
    setProgress,
    bulkSetConsolidationTargets,
    validatorsToConsolidate,
    addValidatorToConsolidate,
  } = useConsolidationStore();

  const walletAddress = useWalletAddress();

  const [activeTab, setActiveTab] = useState<string>("maxConsolidate");

  const { data: validators } = api.validators.getValidators.useQuery(
    {
      address: walletAddress || "",
    },
    { enabled: !!walletAddress },
  );

  const availableSourceValidators = useMemo(() => {
    return validators?.filter(
      (validator) =>
        validator.validatorIndex !== consolidationTarget?.validatorIndex &&
        validator.consolidationTransaction?.isConsolidatedValidator !== false,
    );
  }, [validators, consolidationTarget]);

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
    setProgress(1);
  };

  const handleConsolidationProgression = () => {
    if (validatorsToConsolidate?.length > 0) setProgress(3);
  };

  const handleSourceValidatorSelection = (validator: ValidatorDetails) => {
    addValidatorToConsolidate(validator);
  };

  const newDestinationBalance = useMemo(() => {
    return (
      validatorsToConsolidate.reduce((acc, validator) => {
        return acc + validator.balance;
      }, 0n) + (consolidationTarget?.balance ?? 0n)
    );
  }, [validatorsToConsolidate, consolidationTarget]);

  return (
    <div className="space-y-6">
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
              <ValidatorCard
                hasHover={false}
                shrink={false}
                validator={consolidationTarget}
              />
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
            className="rounded-xl text-gray-800 data-[state=active]:bg-white data-[state=active]:text-indigo-800 dark:data-[state=active]:text-black"
            value="maxConsolidate"
            onClick={() =>
              bulkSetConsolidationTargets(availableSourceValidators ?? [])
            }
          >
            Max consolidate
          </TabsTrigger>

          <TabsTrigger
            className="rounded-xl text-gray-800 data-[state=active]:bg-white data-[state=active]:text-indigo-800 dark:data-[state=active]:text-black"
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
          {availableSourceValidators && (
            <ValidatorList
              sourceValidators={validatorsToConsolidate}
              setSourceValidators={handleSourceValidatorSelection}
              validators={availableSourceValidators}
            />
          )}
        </TabsContent>
      </Tabs>

      <div className="flex flex-row items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <Zap className="h-4 w-4 fill-indigo-500 text-indigo-500" />
        <div>New destination balance:</div>

        <div className="flex items-center gap-1 text-black dark:text-white">
          <AlignLeft className="h-3 w-3" />
          <span>
            {Number(formatEther(newDestinationBalance)).toFixed(
              DECIMAL_PLACES,
            )}{" "}
          </span>
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
        disabled={validatorsToConsolidate.length === 0}
      />
    </div>
  );
};
