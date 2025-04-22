"use client";

import { useRouter } from "next/navigation";
import { TransactionValidatorCard } from "pec/components/validators/cards/TransactionValidatorCard";
import { TransactionStatus } from "pec/types/validator";
import { ArrowRightIcon } from "lucide-react";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { EIconPosition } from "pec/types/components";
import { useConsolidationStore } from "pec/hooks/use-consolidation-store";

export const SubmitConsolidationRequests = () => {
  const {
    consolidationTarget,
    validatorsToConsolidate,
    reset,
  } = useConsolidationStore();

  const router = useRouter();

  const everyTransactionSubmitted = validatorsToConsolidate.every(
    (validator) =>
      validator.consolidationTransaction?.status ===
      TransactionStatus.SUBMITTED,
  );

  const handleDashboardNavigation = () => {
    reset();
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
          <PrimaryButton
            className="w-full"
            label="Track progress in my dashboard"
            icon={<ArrowRightIcon className="h-4 w-4" />}
            iconPosition={EIconPosition.RIGHT}
            onClick={handleDashboardNavigation}
            disabled={false}
          />
        )}

        <div className="flex flex-col gap-2">
          <div className="text-d font-medium">Destination validator</div>
          <TransactionValidatorCard
            validator={consolidationTarget!}
            isTarget={true}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-md font-medium">Source validators</div>

          {validatorsToConsolidate.map((validator) => (
            <TransactionValidatorCard
              key={validator.validatorIndex}
              validator={validator}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
