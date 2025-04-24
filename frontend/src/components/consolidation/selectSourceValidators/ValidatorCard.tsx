import { BadgeMinus } from "lucide-react";
import Image from "next/image";
import { Checkbox } from "pec/components/ui/checkbox";
import { displayedEthAmount } from "pec/lib/utils/validators/balance";
import type { ISourceValidatorCard } from "pec/types/validator";
import type { FC } from "react";
import { formatEther } from "viem";

export const ValidatorCard: FC<
  ISourceValidatorCard & { disabled?: boolean }
> = (props) => {
  const { checked, onClick, validator, disabled = false } = props;
  const withdrawalAddressPrefix = validator.withdrawalAddress.slice(0, 4);

  return (
    <div
      className={`flex-col-3 flex w-full items-center justify-between gap-x-4 rounded-xl border bg-white p-4 dark:bg-black ${
        checked
          ? "border-indigo-500 dark:border-indigo-400"
          : "border-gray-200 dark:border-gray-800"
      } ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:border-indigo-500 dark:hover:border-gray-600"
      }`}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex items-center gap-x-4">
        <Checkbox
          className="rounded-lg data-[state=checked]:bg-indigo-500 data-[state=checked]:text-white data-[state=checked]:dark:text-black"
          checked={checked}
        />

        <Image
          src="/icons/EthValidator.svg"
          alt="Wallet"
          width={24}
          height={24}
        />

        <div className="flex flex-col">
          <div className="text-sm">{validator.validatorIndex}</div>
          <div className="text-xs text-gray-700 dark:text-gray-300">
            {validator.publicKey.slice(0, 6)}...{validator.publicKey.slice(-4)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-2">
        <BadgeMinus className="h-4 w-4 text-gray-800 dark:text-white" />
        <div className="text-sm">{withdrawalAddressPrefix}</div>
      </div>

      <div className="font-semibold">
        Ξ {displayedEthAmount(Number(formatEther(validator.balance)))}
      </div>
    </div>
  );
};
