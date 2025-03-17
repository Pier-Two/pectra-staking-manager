import type { FC } from "react";
import Image from "next/image";
import type { ISourceValidatorCard } from "pec/types/validator";
import { AlignLeft, BadgeMinus } from "lucide-react";
import { Checkbox } from "pec/components/ui/checkbox";

export const ValidatorCard: FC<ISourceValidatorCard> = (props) => {
  const { checked, onClick, validator } = props;
  const withdrawalAddressPrefix = validator.withdrawalAddress.slice(0, 4);

  return (
    <div
      className={`flex-col-3 flex min-h-[10vh] w-full items-center justify-between gap-x-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black ${checked ? "border-gray-800" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-x-4">
        <Checkbox checked={checked} />

        <Image
          src="/icons/EthValidator.svg"
          alt="Wallet"
          width={24}
          height={24}
        />

        <div className="flex flex-col">
          <div className="text-md">{validator.validatorIndex}</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {validator.publicKey.slice(0, 6)}...{validator.publicKey.slice(-4)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-2">
        <BadgeMinus className="h-4 w-4 text-gray-800 dark:text-white" />
        <div className="text-md">{withdrawalAddressPrefix}</div>
      </div>

      <div className="flex items-center gap-1">
        <AlignLeft className="h-3 w-3 text-gray-500" />
        <span> {validator.balance.toFixed(2)}</span>
      </div>
    </div>
  );
};
