import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { Button } from "pec/components/ui/button";
import { PectraSpinner } from "pec/components/ui/custom/pectraSpinner";
import { getBlockExplorerTxUrl, openInNewTab } from "pec/helpers/getExternalLink";
import { cn } from "pec/lib/utils";
import { type ValidatorDetails } from "pec/types/validator";
import type { TxHashRecord } from "pec/types/withdraw";

interface StatusConfig {
  text: string;
  className?: string;
  txHash?: string;
}

interface ValidatorLoadingCardProps {
  transactionStatus: TxHashRecord[number] | undefined;
  validator: ValidatorDetails;
}

const getStatusConfig = (data: ValidatorLoadingCardProps["transactionStatus"]): StatusConfig => {
  switch (data?.status) {
    case 'pending':
      return {
        text: 'Waiting for signature...',
        className: 'text-gray-600 dark:text-gray-400'
      };
    case 'signing':
      return {
        text: 'Signing withdrawal...',
        className: 'text-indigo-600 dark:text-indigo-400'
      };
    case 'submitted':
      return {
        text: 'Submitting Transaction',
        txHash: data?.txHash,
        className: 'text-blue-600 dark:text-blue-400'
      };
    case 'finalised':
      return {
        text: 'Withdrawal successful',
        txHash: data?.txHash,
        className: 'text-green-600 dark:text-green-400'
      };
    case 'failed':
      return {
        text: 'Withdrawal failed',
        txHash: data?.txHash,
        className: 'text-red-600 dark:text-red-400'
      };
    case 'failedToSubmit':
      return {
        text: data?.error,
        className: 'text-red-600 dark:text-red-400'
      };
    default:
      return {
        text: 'Processing...',
        className: 'text-gray-600 dark:text-gray-400'
      };
  }
};

/**
 * @description This component is used to display the status of a validator when withdrawing or consolidating
 * 
 * @param transactionStatus - The status of the transaction
 * @param validator - The validator details
 * @returns 
 */
export const ValidatorLoadingCard = ({
  transactionStatus,
  validator
}: ValidatorLoadingCardProps) => {
  const { validatorIndex, publicKey } = validator;
  const statusConfig = getStatusConfig(transactionStatus);
  const showLoader = statusConfig.text === "Signing withdrawal..." || statusConfig.text === "Submitting Transaction";

  return (
    <div className={cn(
      "flex items-center justify-between",
      "rounded-xl border bg-white px-6 py-4",
      "dark:border-gray-800 dark:bg-black",
      "transition-all duration-200"
    )}>
      <div className="flex items-center gap-x-4">

        {/* Validator */}
        <Image
          src="/icons/EthValidator.svg"
          alt="Validator"
          width={24}
          height={24}
        />
        <div className="flex flex-col">
            <div className="text-sm font-medium">
                {validatorIndex}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
                {publicKey.slice(0, 5)}...{publicKey.slice(-4)}
            </div>
            </div>
        </div>

        {/* Status */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className={cn(
            "flex items-center gap-x-2",
            statusConfig.className
          )}>
            {showLoader && <PectraSpinner />}
            <span className="text-sm">{statusConfig.text}</span>
          </div>

          {/* Etherscan Link */}
          {statusConfig.txHash && (
            <Button 
              variant="link" 
              size="sm"
              className="text-indigo-500 dark:text-indigo-400 flex items-center gap-x-1"
              onClick={() => openInNewTab(getBlockExplorerTxUrl(statusConfig.txHash))}
            >
              {statusConfig.txHash.slice(0, 6)}...
              {statusConfig.txHash.slice(-4)}
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
  );
};