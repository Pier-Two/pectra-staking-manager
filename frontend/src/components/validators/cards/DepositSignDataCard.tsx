import Image from "next/image";
import { Check } from "lucide-react";
import { PectraSpinner } from "pec/components/ui/custom/pectraSpinner";
import { type DepositData } from "pec/lib/api/schemas/deposit";
import { type DepositWorkflowStage } from "pec/types/batch-deposits";
import { displayedEthAmount } from "pec/lib/utils/validators/balance";

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
    <div className="flex-col-3 flex w-full items-center justify-between gap-x-4 rounded-xl border border-indigo-300 bg-white px-4 py-2 dark:border-gray-800 dark:bg-black">
      <div className="flex flex-1 items-center gap-x-4">
        <Image
          src="/icons/EthValidator.svg"
          alt="Validator"
          width={24}
          height={24}
        />

        <div className="flex flex-col">
          <div className="text-md">{validator.validatorIndex}</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {validator.publicKey.slice(0, 5)}...
            {validator.publicKey.slice(-4)}
          </div>
        </div>
      </div>

      <div className="font-semibold">Ξ {displayedEthAmount(amount)}</div>

      {stage.type === "sign-data" && (
        <div className="flex flex-1 items-center gap-1">
          <PectraSpinner />
          <div className="text-sm">Signing...</div>
        </div>
      )}
      {stage.type === "transactions-submitted" && (
        <div className="flex flex-1 items-center gap-1">
          <PectraSpinner />
          <div className="text-sm">Transactions submitted</div>
        </div>
      )}

      {stage.type === "transactions-finalised" && (
        <div className="flex flex-row items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          <div className="text-sm">Done</div>
        </div>
      )}
    </div>
  );
};
