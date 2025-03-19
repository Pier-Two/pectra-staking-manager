import type { FC } from "react";
import type { IConsolidationSummary } from "pec/types/consolidation";
import { ValidatorCard } from "pec/components/validators/ValidatorCard";
import { DetectedValidators } from "pec/components/validators/DetectedValidators";
import { Overview } from "./Overview";
import { Button } from "pec/components/ui/button";
import { Email } from "./Email";

export const ConsolidationSummary: FC<IConsolidationSummary> = (props) => {
  const {
    destinationValidator,
    setSelectedDestinationValidator,
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

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="text-3xl">Consolidation Summary</div>

        <div className="text-md text-gray-700 dark:text-gray-300">
          Review and submit your consolidation request.
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-col gap-2">
          <div className="text-lg font-medium">Destination validator</div>

          <div className="flex items-center justify-center">
            <ValidatorCard
              allowClose={true}
              shrink={false}
              onClick={() => handleResetDestinationValidator()}
              validator={destinationValidator}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-lg font-medium">Source validators</div>
        <DetectedValidators
          cardTitle="selected"
          validators={sourceValidators}
        />
      </div>

      <div className="space-y-2">
        <div className="text-lg font-medium">Summary</div>
        <Overview
          destinationValidator={destinationValidator}
          sourceValidators={sourceValidators}
        />
        <Email
          cardText="Email me when consolidation completes"
          summaryEmail={summaryEmail}
          setSummaryEmail={setSummaryEmail}
        />
      </div>

      <div className="space-y-2">
        <Button
          className="w-full space-x-2 rounded-xl border border-gray-800 bg-black p-4 hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-200"
          onClick={() => handleGenerateTransactions()}
        >
          <div className="text-sm text-white dark:text-black">
            Generate transactions
          </div>
        </Button>

        <div className="text-center text-sm text-gray-700 dark:text-gray-300">
          You will be required to sign {sourceValidators.length + 1}{" "}
          consolidation transactions.
        </div>
      </div>
    </div>
  );
};
