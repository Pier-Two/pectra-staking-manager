import { ExternalLink } from "lucide-react";
import { Button } from "pec/components/ui/button";
import { PectraSpinner } from "pec/components/ui/custom/pectraSpinner";
import {
  getBlockExplorerTxUrl,
  openInNewTab,
} from "pec/helpers/getExternalLink";
import { cn } from "pec/lib/utils";
import type { TransactionStatus } from "pec/types/withdraw";

interface StatusConfig {
  text: string;
  className?: string;
  txHash?: string;
}

const getStatusConfig = (data: TransactionStatus | undefined): StatusConfig => {
  switch (data?.status) {
    case "pending":
      return {
        text: "Waiting for signature...",
        className: "text-gray-600 dark:text-gray-400",
      };
    case "signing":
      return {
        text: "Signing withdrawal...",
        className: "text-indigo-600 dark:text-indigo-400",
      };
    case "submitted":
      return {
        text: "Submitting Transaction",
        txHash: data?.txHash,
        className: "text-blue-600 dark:text-blue-400",
      };
    case "finalised":
      return {
        text: "Withdrawal successful",
        txHash: data?.txHash,
        className: "text-green-600 dark:text-green-400",
      };
    case "failed":
      return {
        text: "Withdrawal failed",
        txHash: data?.txHash,
        className: "text-red-600 dark:text-red-400",
      };
    case "failedToSubmit":
      return {
        text: data?.error,
        className: "text-red-600 dark:text-red-400",
      };
    default:
      return {
        text: "Processing...",
        className: "text-gray-600 dark:text-gray-400",
      };
  }
};

interface SubmittingTransactionTableComponentProps {
  transactionStatus: TransactionStatus | undefined;
}

export const SubmittingTransactionTableComponent = ({
  transactionStatus,
}: SubmittingTransactionTableComponentProps) => {
  const statusConfig = getStatusConfig(transactionStatus);
  const showLoader =
    statusConfig.text === "Signing withdrawal..." ||
    statusConfig.text === "Submitting Transaction";

  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row">
      <div className={cn("flex items-center gap-x-2", statusConfig.className)}>
        {showLoader && <PectraSpinner />}
        <span className="text-sm">{statusConfig.text}</span>
      </div>

      {/* Etherscan Link */}
      {statusConfig.txHash && (
        <Button
          variant="link"
          size="sm"
          className="flex items-center gap-x-1 text-indigo-500 dark:text-indigo-400"
          onClick={() =>
            openInNewTab(getBlockExplorerTxUrl(statusConfig.txHash))
          }
        >
          {statusConfig.txHash.slice(0, 6)}...
          {statusConfig.txHash.slice(-4)}
          <ExternalLink className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
