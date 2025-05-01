import { CircleCheck, ExternalLink, OctagonMinus } from "lucide-react";
import { Button } from "pec/components/ui/button";
import { PectraSpinner } from "pec/components/ui/custom/pectraSpinner";
import Image from "next/image";
import {
  getBlockExplorerTxUrl,
  openInNewTab,
} from "pec/helpers/getExternalLink";
import { cn } from "pec/lib/utils";
import { type ValidatorDetails } from "pec/types/validator";
import type { TransactionStatus } from "pec/types/withdraw";
import { displayedEthAmount } from "pec/lib/utils/validators/balance";

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
        text: "Signing transaction...",
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
        text: "Transaction successful",
        txHash: data?.txHash,
        className: "text-green-600 dark:text-green-400",
      };
    case "failed":
      return {
        text: "Transaction failed",
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
    statusConfig.text === "Signing transaction..." ||
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

interface TableComponentProps {
  validator: ValidatorDetails;
}

export const ValidatorIndex = ({ validator }: TableComponentProps) => {
  return (
    <div className="flex flex-row gap-2">
      <Image
        src="/icons/EthValidator.svg"
        alt="Wallet"
        width={24}
        height={24}
      />
      <div className="flex flex-col gap-1 text-sm text-piertwo-text">
        <div className="font-semibold">{validator.validatorIndex}</div>
        <div className="font-light">
          {validator.publicKey.slice(0, 5)}...
          {validator.publicKey.slice(-5)}
        </div>
      </div>
    </div>
  );
};

export const WithdrawalAddress = ({ validator }: TableComponentProps) => {
  return (
    <div className="flex items-center gap-1">
      {validator.withdrawalAddress.includes("0x02") ? (
        <CircleCheck className="h-4 w-4 fill-green-500 text-white dark:text-black" />
      ) : (
        <OctagonMinus className="h-4 w-4 text-gray-500 dark:text-white" />
      )}
      <div className="text-sm font-semibold">
        {validator.withdrawalAddress.slice(0, 4)}
      </div>
    </div>
  );
};

interface DisplayAmountProps {
  amount: number;
  className?: string;
  opts?: {
    decimals?: number;
  };
  children?: React.ReactNode;
}

export const DisplayAmount = ({
  amount,
  className,
  opts,
  children,
}: DisplayAmountProps) => {
  return (
    <div className={cn("text-sm font-semibold", className)}>
      <span className="hidden md:contents">Ξ</span>{" "}
      {displayedEthAmount(amount, opts?.decimals)}
      {children}
    </div>
  );
};
