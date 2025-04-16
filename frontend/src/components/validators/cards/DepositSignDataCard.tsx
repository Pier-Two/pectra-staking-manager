import Image from "next/image";
import { AlignLeft } from "lucide-react";
import { DECIMAL_PLACES } from "pec/lib/constants";
import { PectraSpinner } from "pec/components/ui/custom/pectraSpinner";
import { formatEther } from "viem";
import { DepositData } from "pec/lib/api/schemas/deposit";

export interface IDepositSignDataCard {
  deposit: DepositData;
}

export const DepositSignDataCard = ({ deposit }: IDepositSignDataCard) => {
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

      <div className="flex flex-1 items-center gap-1">
        <AlignLeft className="h-4 w-4" />
        <div className="text-sm">
          {Number(formatEther(amount)).toFixed(DECIMAL_PLACES)}
        </div>
      </div>

      <div className="flex flex-1 items-center gap-1">
        <PectraSpinner />
        <div className="text-sm">Signing...</div>
      </div>
    </div>
  );
};
