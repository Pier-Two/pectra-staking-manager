"use client";

import type { FC } from "react";
import { useRouter } from "next/navigation";
import type { IConsolidationSubmission } from "pec/types/consolidation";
import { TransactionValidatorCard } from "pec/components/validators/cards/TransactionValidatorCard";
import { TransactionStatus } from "pec/types/validator";
import { Email } from "../summary/Email";
import { ArrowRightIcon } from "lucide-react";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { EIconPosition } from "pec/types/components";

export const SubmitConsolidationRequests: FC<IConsolidationSubmission> = ({
  consolidationEmail,
  destinationValidator,
  setConsolidationEmail,
  sourceValidators,
}) => {
  const router = useRouter();

  const everyTransactionSubmitted = sourceValidators.every(
    (validator) =>
      validator.consolidationTransaction?.status ===
      TransactionStatus.SUBMITTED,
  );

  const handleDashboardNavigation = () => {
    router.push("/dashboard");
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="text-2xl font-medium">
          {everyTransactionSubmitted
            ? "Done!"
            : "Submit Consolidation Requests"}
        </div>

        <div className="text-sm text-gray-700 dark:text-gray-300">
          {everyTransactionSubmitted
            ? "Your requests have all been submitted onchain. Please allow up to 24h for your request to be processed."
            : "Sign each transaction to process your request."}
        </div>

        {everyTransactionSubmitted && (
          <>
            <Email
              cardText={"Enter your email to receive notifications."}
              cardTitle={"Email me when consolidation completes"}
              summaryEmail={consolidationEmail}
              setSummaryEmail={setConsolidationEmail}
            />

            <PrimaryButton
              className="w-full"
              label="Track progress in my dashboard"
              icon={<ArrowRightIcon className="h-4 w-4" />}
              iconPosition={EIconPosition.RIGHT}
              onClick={handleDashboardNavigation}
              disabled={false}
            />
          </>
        )}

        <div className="flex flex-col gap-2">
          <div className="text-d font-medium">Destination validator</div>
          <TransactionValidatorCard
            status={
              destinationValidator.consolidationTransaction?.status ??
              TransactionStatus.UPCOMING
            }
            transactionHash={
              destinationValidator.consolidationTransaction?.hash ?? ""
            }
            validator={destinationValidator}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-md font-medium">Source validators</div>

          {sourceValidators.map((validator) => (
            <TransactionValidatorCard
              key={validator.validatorIndex}
              status={
                validator.consolidationTransaction?.status ??
                TransactionStatus.UPCOMING
              }
              transactionHash={validator.consolidationTransaction?.hash ?? ""}
              validator={validator}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
