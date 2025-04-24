"use client";

import { Pencil } from "lucide-react";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { SecondaryButton } from "pec/components/ui/custom/SecondaryButton";
import { ValidatorCard } from "pec/components/validators/cards/ValidatorCard";
import { DetectedValidators } from "pec/components/validators/DetectedValidators";
import { useSubmitConsolidate } from "pec/hooks/use-consolidation";
import { useConsolidationStore } from "pec/hooks/use-consolidation-store";
import { EIconPosition } from "pec/types/components";
import { useState } from "react";
import { Email } from "./Email";
import { Overview } from "./Overview";

export const ConsolidationSummary = () => {
  const {
    summaryEmail,
    setSummaryEmail,
    bulkSetConsolidationTargets,
    validatorsToConsolidate,
    reset,
    consolidationTarget,
    setProgress,
  } = useConsolidationStore();
  const [showEmail, setShowEmail] = useState(false);

  const handleResetDestinationValidator = () => {
    reset();
    setProgress(1);
  };

  const { mutateAsync: submitConsolidationTx } = useSubmitConsolidate();

  const handleGenerateTransactions = async () => {
    setProgress(4);
    await submitConsolidationTx();
  };

  const handleResetSourceValidators = () => {
    bulkSetConsolidationTargets([]);
    setProgress(2);
  };

  const getTransactionsRequired = () => {
    if (!validatorsToConsolidate || !consolidationTarget) return;

    return {
      // the amount of transactions required to move validators from 0x01 to 0x02
      upgradeTransactions:
        validatorsToConsolidate.filter(
          (item) => !item.withdrawalAddress.startsWith("0x02"),
        ).length +
        (consolidationTarget.withdrawalAddress.startsWith("0x02") ? 0 : 1),
      consolidationTransactions: validatorsToConsolidate.length,
    };
  };

  // Calculate transactions data once before the return statement
  const transactionsData = getTransactionsRequired();
  const totalTransactions = transactionsData
    ? transactionsData.consolidationTransactions +
      transactionsData.upgradeTransactions
    : 0;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="text-2xl font-medium">Consolidation Summary</div>

        <div className="text-sm text-gray-700 dark:text-gray-300">
          Review and submit your consolidation request.
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-col gap-2">
          <div className="text-md font-medium">Destination validator</div>

          <div className="flex flex-col items-center justify-center gap-4">
            <ValidatorCard
              hasHover={false}
              shrink={false}
              validator={consolidationTarget!}
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

      <div className="space-y-4">
        <div className="text-md font-medium">Source validators</div>
        <DetectedValidators
          cardTitle="selected"
          validators={validatorsToConsolidate}
        />

        <SecondaryButton
          className="w-full"
          label="Change source"
          icon={<Pencil className="h-4 w-4" />}
          iconPosition={EIconPosition.LEFT}
          onClick={() => handleResetSourceValidators()}
          disabled={false}
        />
      </div>

      <div className="space-y-2">
        <div className="text-md font-medium">Summary</div>
        <Overview />

        <Email
          showEmail={showEmail}
          setShowEmail={setShowEmail}
          cardText="Add your email to receive an email when your consolidation is complete."
          cardTitle="Notify me when complete"
          summaryEmail={summaryEmail}
          setSummaryEmail={setSummaryEmail}
        />
      </div>

      <div className="space-y-2">
        <PrimaryButton
          className="w-full"
          label="Generate transactions"
          onClick={() => handleGenerateTransactions()}
          disabled={false}
        />

        <div className="text-center text-sm text-gray-700 dark:text-gray-300">
          {transactionsData && (
            <div>
              <p>
                You will be required to submit {totalTransactions} transactions.
              </p>

              <p className="text-xs">
                ({transactionsData.upgradeTransactions}{" "}
                {transactionsData.upgradeTransactions > 1
                  ? "transactions are "
                  : "transaction is "}{" "}
                required to upgrade your validators to version 0x02)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
