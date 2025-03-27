import type { FC } from "react";
import Image from "next/image";
import type { IValidatorCard } from "pec/types/validator";
import { AlignLeft, BadgeMinus } from "lucide-react";
import { DECIMAL_PLACES } from "pec/lib/constants";

export const ValidatorCard: FC<IValidatorCard> = (props) => {
  const { hasBackground, hasHover, shrink, validator, onClick } = props;
  const withdrawalAddressPrefix = validator.withdrawalAddress.slice(0, 4);

  return (
    <div
      className={`flex-col-3 flex ${shrink ? "w-[90%]" : "w-full"} items-center justify-between gap-x-4 rounded-xl border p-4 border-indigo-200 dark:border-gray-800 ${hasBackground ? "bg-white dark:bg-black" : ""} ${hasHover ? "hover:border-indigo-500 dark:hover:border-gray-600" : ""}`}
      onClick={onClick}
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

      <div className="flex items-center gap-x-2">
        <BadgeMinus className="h-4 w-4 text-gray-800 dark:text-white" />
        <div className="text-md">{withdrawalAddressPrefix}</div>
      </div>

      <div className="flex items-center gap-1">
        <AlignLeft className="h-3 w-3 text-gray-500 dark:text-white" />
        <span>{validator.balance.toFixed(DECIMAL_PLACES)}</span>
      </div>
    </div>
  );
};
