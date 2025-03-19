import type { FC } from "react";
import Image from "next/image";
import {
  TransactionStatus,
  type ITransactionValidatorCard,
} from "pec/types/validator";
import { PectraSpinner } from "../ui/pectraSpinner";
import { CircleCheck, ExternalLink } from "lucide-react";

export const TransactionValidatorCard: FC<ITransactionValidatorCard> = (
  props,
) => {
  const { status, validator, transactionHash } = props;

  const upcomingStatus = (
    <div className="text-gray-700 dark:text-gray-300">Upcoming</div>
  );

  const inProgressStatus = (
    <div className="flex items-center gap-1">
      <PectraSpinner />
      <span className="text-black">Sign transaction</span>
    </div>
  );

  const submittedStatus = (
    <div className="flex items-center gap-1">
      <span className="text-sm text-indigo-500">
        {transactionHash.slice(0, 6)}...{transactionHash.slice(-4)}
      </span>
      <ExternalLink className="h-3 w-3 text-indigo-500" />
      <CircleCheck fill="green" className="text-white" />
      <span className="text-black">Submitted</span>
    </div>
  );

  return (
    <div
      className={`flex min-h-[10vh] items-center justify-between gap-x-4 rounded-xl border ${
        status === TransactionStatus.IN_PROGRESS
          ? "border-gray-500"
          : "border-gray-200"
      } bg-white p-4 dark:border-gray-800 dark:bg-black`}
    >
      <div className="flex items-center gap-x-4">
        <Image
          src="/icons/EthValidator.svg"
          alt="Wallet"
          width={24}
          height={24}
        />

        <div className="flex flex-col">
          <div className="text-md">{validator.validatorIndex}</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {validator.publicKey.slice(0, 5)}...{validator.publicKey.slice(-4)}
          </div>
        </div>
      </div>

      {status === TransactionStatus.UPCOMING && upcomingStatus}
      {status === TransactionStatus.IN_PROGRESS && inProgressStatus}
      {status === TransactionStatus.SUBMITTED && submittedStatus}
    </div>
  );
};
