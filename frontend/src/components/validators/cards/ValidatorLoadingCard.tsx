import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { Button } from "pec/components/ui/button";
import { PectraSpinner } from "pec/components/ui/custom/pectraSpinner";
import { cn } from "pec/lib/utils";
import { type ValidatorDetails } from "pec/types/validator";
import type { TxHashRecord } from "pec/types/withdraw";

interface StatusConfig {
  text: string;
  icon: JSX.Element;
  className?: string;
  txHash?: string;
}

interface ValidatorLoadingCardProps {
  transactionStatus: TxHashRecord[number] | undefined;
  validator: ValidatorDetails;
}

const getBlockExplorerTxUrl = (txHash: string | undefined) => {
  if (!txHash) return '';
  return `https://etherscan.io/tx/${txHash}`;
};

const openInNewTab = (url: string) => {
  if (!url) return;
  window.open(url, '_blank', 'noopener,noreferrer');
};

const getStatusConfig = (data: ValidatorLoadingCardProps["transactionStatus"]): StatusConfig => {
  switch (data?.status) {
    case 'pending':
      return {
        text: 'Waiting for signature...',
        icon: <PectraSpinner />,
        className: 'text-gray-600 dark:text-gray-400'
      };
    case 'signing':
      return {
        text: 'Signing withdrawal...',
        icon: <PectraSpinner />,
        className: 'text-indigo-600 dark:text-indigo-400'
      };
    case 'submitted':
      return {
        text: 'Submitting Transaction',
        icon: <ExternalLink className="h-5 w-5" />,
        txHash: data?.txHash,
        className: 'text-blue-600 dark:text-blue-400'
      };
    case 'finalised':
      return {
        text: 'Withdrawal successful',
        icon: <ExternalLink className="h-5 w-5" />,
        txHash: data?.txHash,
        className: 'text-green-600 dark:text-green-400'
      };
    default:
      return {
        text: 'Processing...',
        icon: <PectraSpinner />,
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

  return (
    <div className={cn(
      "flex items-center justify-between",
      "rounded-xl border bg-white px-6 py-4",
      "dark:border-gray-800 dark:bg-black",
      "transition-all duration-200"
    )}>
      <div className="flex items-center gap-x-4">
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

        

        <div className={cn(
            "flex items-center gap-x-2",
            statusConfig.className
        )}>
            <span className="text-sm font-medium">
            {statusConfig.text}
            </span>
        </div>

        {statusConfig.txHash && (
            <div className={cn(
            "flex items-center",
            statusConfig.className
            )}>
            <Button 
                variant="link" 
                size="sm"
                className="mt-1 dark:text-gray-400 text-gray-600"
                onClick={() => openInNewTab(getBlockExplorerTxUrl(statusConfig.txHash))}
            >
                View on Etherscan
                {statusConfig.icon}
            </Button>
            </div>
        )}
    </div>
  );
};