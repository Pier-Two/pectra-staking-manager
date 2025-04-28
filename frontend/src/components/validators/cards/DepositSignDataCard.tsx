import { Check } from "lucide-react";
import Image from "next/image";
import { PectraSpinner } from "pec/components/ui/custom/pectraSpinner";
import { type DepositData } from "pec/lib/api/schemas/deposit";
import { DECIMAL_PLACES } from "pec/lib/constants";
import { type DepositWorkflowStage } from "pec/types/batch-deposits";

export interface IDepositSignDataCard {
  deposit: DepositData;
  stage: DepositWorkflowStage;
}

export const DepositSignDataCard = ({
  deposit,
  stage,
}: IDepositSignDataCard) => {
  const { validator, amount } = deposit;

  return (
    <div className="flex-col-3 flex w-full items-center justify-between gap-x-4 rounded-2xl border border-border bg-white px-4 py-2 dark:border-gray-800 dark:bg-black">
      <div className="flex flex-1 items-center gap-x-4">
        <Image
          src="/icons/EthValidator.svg"
          alt="Validator"
          width={24}
          height={24}
        />

        <div className="flex flex-col">
          <div className="text-sm font-570">{validator.validatorIndex}</div>
          <div className="text-sm font-light text-[#4C4C4C] dark:text-gray-300">
            {validator.publicKey.slice(0, 5)}...
            {validator.publicKey.slice(-4)}
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center gap-1 font-inter text-sm font-570">
        Ξ {amount.toFixed(DECIMAL_PLACES)}
      </div>

      {stage.type === "sign-data" && (
        <div className="flex flex-1 items-center gap-1">
          <PectraSpinner />
          <div className="text-sm font-570">Signing...</div>
        </div>
      )}
      {stage.type === "transactions-submitted" && (
        <div className="flex flex-1 items-center gap-1">
          <PectraSpinner />
          <div className="text-sm font-570">Transactions submitted</div>
        </div>
      )}

      {stage.type === "transactions-finalised" && (
        <div className="flex flex-row items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          <div className="text-sm font-570">Done</div>
        </div>
      )}
    </div>
  );
};
