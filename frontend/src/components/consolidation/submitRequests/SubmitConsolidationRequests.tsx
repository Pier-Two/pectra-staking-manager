import { useRouter } from "next/navigation";
import { ValidatorDetails } from "pec/types/validator";
import { ArrowRightIcon } from "lucide-react";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { EIconPosition } from "pec/types/components";
import { ValidatorTable } from "pec/components/ui/table/ValidatorTable";
import {
  SUBMITTING_CONSOLIDATION_TABLE_HEADERS,
  SubmittingConsolidationValidatorDetails,
} from "pec/constants/columnHeaders";
import { ValidatorCardWrapper } from "pec/components/ui/custom/validator-card-wrapper";
import { ValidatorIndex } from "pec/components/ui/table/TableComponents";
import { PectraSpinner } from "pec/components/ui/custom/pectraSpinner";
import { Separator } from "@radix-ui/react-separator";

interface SubmitConsolidationRequestsProps {
  destination: ValidatorDetails;
  reset: () => void;
  transactions: SubmittingConsolidationValidatorDetails[];
}

export const SubmitConsolidationRequests = ({
  destination,
  reset,
  transactions,
}: SubmitConsolidationRequestsProps) => {
  const router = useRouter();

  const everyTransactionSubmitted = false;

  // const everyTransactionSubmitted = validatorsToConsolidate.every(
  //   (validator) =>
  //     validator.consolidationTransaction?.status ===
  //     TransactionStatus.SUBMITTED,
  // );

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

        <div className="text-base">
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

        <ValidatorCardWrapper isSelected>
          <ValidatorIndex validator={destination} />
          <Separator
            className="mx-5 h-12 bg-gray-200 dark:bg-gray-800"
            orientation="vertical"
          />
          <PectraSpinner />
        </ValidatorCardWrapper>

        <ValidatorTable
          headers={SUBMITTING_CONSOLIDATION_TABLE_HEADERS}
          data={transactions}
          disableSort
        />
      </div>
    </div>
  );
};
