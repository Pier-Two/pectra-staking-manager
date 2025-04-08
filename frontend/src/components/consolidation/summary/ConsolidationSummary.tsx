"use client";

import type { FC } from "react";
import type { IConsolidationSummary } from "pec/types/consolidation";
import { ValidatorCard } from "pec/components/validators/cards/ValidatorCard";
import { DetectedValidators } from "pec/components/validators/DetectedValidators";
import { Overview } from "./Overview";
import { Email } from "./Email";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { SecondaryButton } from "pec/components/ui/custom/SecondaryButton";
import { Pencil } from "lucide-react";
import { EIconPosition } from "pec/types/components";

export const ConsolidationSummary: FC<IConsolidationSummary> = (props) => {
  const {
    destinationValidator,
    setSelectedDestinationValidator,
    setSelectedSourceValidators,
    sourceValidators,
    setProgress,
    summaryEmail,
    setSummaryEmail,
  } = props;

  const handleResetDestinationValidator = () => {
    setSelectedDestinationValidator(null);
    setProgress(1);
  };

  const handleGenerateTransactions = () => {
    setProgress(4);
  };

  const handleResetSourceValidators = () => {
    setSelectedSourceValidators([]);
    setProgress(2);
  };

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

      <div className="space-y-4">
        <div className="text-md font-medium">Source validators</div>
        <DetectedValidators
          cardTitle="selected"
          validators={sourceValidators}
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
        <Overview
          destinationValidator={destinationValidator}
          sourceValidators={sourceValidators}
        />

        <Email
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
          You will be required to sign {sourceValidators.length + 1}{" "}
          consolidation transactions.
        </div>
      </div>
    </div>
  );
};
