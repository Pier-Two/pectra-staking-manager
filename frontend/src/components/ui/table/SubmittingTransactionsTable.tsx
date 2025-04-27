import { ValidatorLoadingCard } from "pec/components/validators/cards/ValidatorLoadingCard";
import { ValidatorDetails } from "pec/types/validator";
import { TransactionStatus, TxHashRecord } from "pec/types/withdraw";

interface SubmittingTransactionsTableProps {
  validators: ValidatorDetails[];
  txHashRecord: TxHashRecord;
}

export const SubmittingTransactionsTable = ({
  validators,
  txHashRecord,
}: SubmittingTransactionsTableProps) => {
  return (
    <div className="flex flex-col gap-y-2">
      {validators.map((validator, index) => {
        const status = txHashRecord[validator.validatorIndex]?.status as
          | TransactionStatus
          | undefined;

        if (!status) {
          return null;
        }

        return (
          <ValidatorLoadingCard
            key={index}
            validator={validator}
            transactionStatus={status}
          />
        );
      })}
    </div>
  );
};
