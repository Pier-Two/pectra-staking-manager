"use client";

import type { FC } from "react";
import { useRouter } from "next/navigation";
import type { IConsolidationSubmission } from "pec/types/consolidation";
import { TransactionValidatorCard } from "pec/components/validators/TransactionValidatorCard";
import { TransactionStatus } from "pec/types/validator";
import { Email } from "../summary/Email";
import { Button } from "pec/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

export const SubmitConsolidationRequests: FC<IConsolidationSubmission> = (
  props,
) => {
  const {
    consolidationEmail,
    destinationValidator,
    setConsolidationEmail,
    sourceValidators,
  } = props;

  const router = useRouter();

  const everyTransactionSubmitted = sourceValidators.every(
    (validator) => validator.transactionStatus === TransactionStatus.SUBMITTED,
  );

  const handleDashboardNavigation = () => {
    router.push("/dashboard");
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="text-3xl">
          {everyTransactionSubmitted
            ? "Done!"
            : "Submit Consolidation Requests"}
        </div>
        <div className="text-md text-gray-700 dark:text-gray-300">
          {everyTransactionSubmitted
            ? "Your requests have all been submitted onchain. Please allow up to 24h for your request to be processed."
            : "Sign each transaction to process your request."}
        </div>

        {everyTransactionSubmitted && (
          <>
            <Email
              cardText={"Email me when consolidation completes"}
              summaryEmail={consolidationEmail}
              setSummaryEmail={setConsolidationEmail}
            />

            <Button
              className="w-full space-x-2 rounded-xl border border-gray-800 bg-black p-4 hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-200"
              onClick={handleDashboardNavigation}
            >
              <div className="text-sm text-white dark:text-black">
                Track progress in my dashboard
              </div>
              <ArrowRightIcon className="h-4 w-4 text-white dark:text-black" />
            </Button>
          </>
        )}

        <div className="flex flex-col gap-2">
          <div className="text-lg font-medium">Destination validator</div>

          <TransactionValidatorCard
            status={destinationValidator.transactionStatus}
            transactionHash={destinationValidator.transactionHash}
            validator={destinationValidator}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-lg font-medium">Source validators</div>

          {sourceValidators.map((validator) => (
            <TransactionValidatorCard
              key={validator.validatorIndex}
              status={validator.transactionStatus}
              transactionHash={validator.transactionHash}
              validator={validator}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
