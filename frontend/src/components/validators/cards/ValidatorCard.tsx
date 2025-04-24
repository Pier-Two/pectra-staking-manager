import clsx from "clsx";
import { BadgeMinus } from "lucide-react";
import Image from "next/image";
import { formatValidatorIndex } from "pec/helpers/formatValidatorIndex";
import { displayedEthAmount } from "pec/lib/utils/validators/balance";
import { ValidatorDetails } from "pec/types/validator";
import type { FC } from "react";

export interface IValidatorCard {
  hasHover: boolean;
  shrink: boolean;
  validator: ValidatorDetails;
  onClick?: () => void;
  info?: string;
  tooltip?: string;
  className?: string;
}

export const ValidatorCard: FC<IValidatorCard> = (props) => {
  const { hasHover, shrink, validator, onClick, info, className } = props;
  const withdrawalAddressPrefix = validator.withdrawalAddress.slice(0, 4);

  return (
    <div
      className={clsx(
        "flex-col-3 flex h-16 items-center justify-between gap-x-4 rounded-2xl border border-border bg-white px-4 py-2 dark:border-gray-800 dark:bg-black",
        shrink ? "w-[95%]" : "w-full",
        hasHover && "hover:border-indigo-500 dark:hover:border-gray-600",
        { "cursor-pointer": onClick },
        className,
      )}
      onClick={onClick}
    >
      <div className="flex grow basis-0 items-center gap-x-4">
        <Image
          src="/icons/EthValidator.svg"
          alt="Wallet"
          width={24}
          height={24}
        />

        <div className="flex h-10 flex-col gap-y-3">
          <div className="text-[14px] font-570 leading-[14px] text-[#4C4C4C] dark:text-zinc-50">
            {formatValidatorIndex(validator.validatorIndex)} {info && info}
          </div>
          <div className="text-[14px] font-380 leading-[14px] text-[#4C4C4C] dark:text-gray-300">
            {validator.publicKey.slice(0, 5)}...
            {validator.publicKey.slice(-5)}
          </div>
        </div>
      </div>

      <div className="flex grow basis-0 items-center justify-center gap-x-1">
        <BadgeMinus className="h-4 w-4 text-zinc-400" />
        <div className="mt-[2px] text-[14px] font-570 leading-[14px]">
          {withdrawalAddressPrefix}
        </div>
      </div>

      <p className="grow basis-0 items-end text-right text-[14px] font-570">
        Ξ {displayedEthAmount(validator.balance)}
      </p>
    </div>
  );
};
