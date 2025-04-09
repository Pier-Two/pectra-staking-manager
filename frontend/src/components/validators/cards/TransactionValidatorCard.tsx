import { type FC } from "react";
import Image from "next/image";
import {
  TransactionStatus,
  type ITransactionValidatorCard,
} from "pec/types/validator";
import { PectraSpinner } from "../../ui/custom/pectraSpinner";
import { CircleCheck, ExternalLink } from "lucide-react";
import { Button } from "pec/components/ui/button";
import { useSubmitConsolidate } from "pec/hooks/use-consolidation";
import { useConsolidationStore } from "pec/hooks/use-consolidation-store";

export const TransactionValidatorCard: FC<ITransactionValidatorCard> = (
  props,
) => {
  const { status, validator, transactionHash, isTarget } = props;

  const { currentPubKey } = useConsolidationStore();

  const {
    mutateAsync: submitConsolidationTx,
    isPending: isSubmittingConsolidateTransactions,
  } = useSubmitConsolidate();

  const upcomingStatus = (
    <div className="text-xs text-gray-700 dark:text-gray-300">Upcoming</div>
  );

  const inProgressStatus = (
    <div className="flex items-center gap-1 text-xs">
      <PectraSpinner />
      <span className="text-black dark:text-white">Sign transaction</span>
    </div>
  );

  const submittedStatus = (
    <div className="flex items-center gap-1 text-xs">
      <span className="text-sm text-indigo-500">
        {transactionHash.slice(0, 6)}...{transactionHash.slice(-4)}
      </span>
      <ExternalLink className="h-3 w-3 text-indigo-500" />
      <CircleCheck className="h-4 w-4 fill-green-500 text-indigo-50 dark:text-black" />
      <span className="text-black dark:text-white">Submitted</span>
    </div>
  );

  return (
    <div
      className={`flex items-center justify-between gap-x-4 rounded-xl border p-4 dark:border-gray-800 dark:bg-black ${status === TransactionStatus.IN_PROGRESS ? "border-indigo-400" : ""}`}
    >
      <div className="flex items-center gap-x-4">
        <Image
          src="/icons/EthValidator.svg"
          alt="Wallet"
          width={24}
          height={24}
        />

        <div className="flex flex-col">
          <div className="text-sm">{validator.validatorIndex}</div>
          <div className="text-xs text-gray-700 dark:text-gray-300">
            {validator.publicKey.slice(0, 5)}...{validator.publicKey.slice(-4)}
          </div>
        </div>
      </div>

      {!isTarget && !isSubmittingConsolidateTransactions && !currentPubKey && (
        <div className="flex flex-col justify-center gap-2 text-center">
          {status === TransactionStatus.UPCOMING && upcomingStatus}

          {status === TransactionStatus.UPCOMING && (
            <Button
              variant="outline"
              className="rounded-xl text-xs"
              size="sm"
              onClick={async () => {
                try {
                  await submitConsolidationTx();
                } catch (error) {
                  console.error(
                    "Failed to submit consolidation transaction:",
                    error,
                  );
                }
              }}
            >
              Consolidate
            </Button>
          )}
        </div>
      )}

      {
        <>
          {(status === TransactionStatus.IN_PROGRESS ||
            currentPubKey === validator.publicKey) &&
            inProgressStatus}
          {status === TransactionStatus.SUBMITTED && submittedStatus}
        </>
      }
    </div>
  );
};
