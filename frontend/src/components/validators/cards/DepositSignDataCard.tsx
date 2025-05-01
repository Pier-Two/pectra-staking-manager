import { Check } from "lucide-react";
import { PectraSpinner } from "pec/components/ui/custom/pectraSpinner";
import { TransactionStatus } from "pec/types/withdraw";

export interface IDepositSignDataCard {
  transactionStatus: TransactionStatus;
}

export const DepositSignDataCard = ({
  transactionStatus,
}: IDepositSignDataCard) => {
  return (
    <>
      {transactionStatus.status === "signing" && (
        <div className="flex flex-1 items-center gap-1">
          <PectraSpinner />
          <div className="text-sm font-570">Signing...</div>
        </div>
      )}
      {transactionStatus.status === "submitted" && (
        <div className="flex flex-1 items-center gap-1">
          <PectraSpinner />
          <div className="text-sm font-570">Transactions submitted</div>
        </div>
      )}
      {transactionStatus.status === "finalised" && (
        <div className="flex flex-row items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          <div className="text-sm font-570">Done</div>
        </div>
      )}
    </>
  );
};
