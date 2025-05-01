import { CircleCheck, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Button } from "pec/components/ui/button";
import {
  getBlockExplorerTxUrl,
  openInNewTab,
} from "pec/helpers/getExternalLink";
import { useConsolidationStore } from "pec/hooks/use-consolidation-store";
import { cn } from "pec/lib/utils";
import type { ValidatorDetails } from "pec/types/validator";
import { TransactionStatus } from "pec/types/validator";
import { type FC } from "react";
import { PectraSpinner } from "../../ui/custom/pectraSpinner";

export interface ITransactionValidatorCard {
  validator: ValidatorDetails;
  isTarget?: boolean;
}

const getStatusConfig = (
  validator: ValidatorDetails,
): {
  classname?: string;
  component: React.ReactNode;
} => {
  switch (validator.consolidationTransaction?.status) {
    case TransactionStatus.SUBMITTED:
      return {
        component: (
          <div
            className="flex items-center gap-1 text-xs hover:cursor-pointer"
            onClick={() =>
              openInNewTab(
                getBlockExplorerTxUrl(validator.consolidationTransaction?.hash),
              )
            }
          >
            <span className="text-sm text-indigo-500">
              {validator.consolidationTransaction?.hash.slice(0, 6)}...
              {validator.consolidationTransaction?.hash.slice(-4)}
            </span>
            <ExternalLink className="h-3 w-3 text-indigo-500" />
            <CircleCheck className="h-4 w-4 fill-green-500 text-indigo-50 dark:text-black" />
            <span className="text-black dark:text-white">Submitted</span>
          </div>
        ),
      };
    case TransactionStatus.IN_PROGRESS:
      return {
        classname: "border-indigo-400 dark:border-gray-600",
        component: (
          <div className="flex items-center gap-x-2 text-xs">
            <PectraSpinner />
            <span className="text-black dark:text-white">
              Signing transaction
            </span>
          </div>
        ),
      };
    // Use Upcoming as the default as validators that are not yet consolidated have an undefined TransactionStatus
    default:
      return {
        component: (
          <div className="text-xs text-gray-700 dark:text-gray-300">
            Upcoming
          </div>
        ),
      };
  }
};

export const TransactionValidatorCard: FC<ITransactionValidatorCard> = (
  props,
) => {
  const { validator, isTarget } = props;
  const { currentPubKey } = useConsolidationStore();

  const isSubmittingConsolidateTransactions = true;

  const statusConfig = getStatusConfig(validator);
  const showConsolidateButton =
    !isTarget && !isSubmittingConsolidateTransactions && !currentPubKey;
  const isUpcoming =
    validator.consolidationTransaction?.status === TransactionStatus.UPCOMING;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-x-4 rounded-xl border p-4 dark:border-gray-800 dark:bg-black",
        statusConfig?.classname,
      )}
    >
      {/* Validator details */}
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

      {/* Consolidation retry button for errored out transactions */}
      <div className="flex items-center gap-2">
        {showConsolidateButton && isUpcoming && (
          <Button
            variant="outline"
            className="rounded-xl text-xs"
            size="sm"
            onClick={async () => {
              try {
                throw new Error("Not implemented");
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

        {/* Current status component */}
        {statusConfig.component}
      </div>
    </div>
  );
};
