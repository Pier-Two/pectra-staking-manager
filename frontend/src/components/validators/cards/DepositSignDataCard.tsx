import type { FC } from "react";
import Image from "next/image";
import type { IDepositSignDataCard } from "pec/types/batch-deposits";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { SecondaryButton } from "pec/components/ui/custom/SecondaryButton";
import { AlignLeft, Copy } from "lucide-react";
import { EIconPosition } from "pec/types/components";

export const DepositSignDataCard: FC<IDepositSignDataCard> = (props) => {
  const { deposit } = props;
  const { validator, depositAmount } = deposit;

  return (
    <div className="flex-col-3 flex w-full items-center justify-between gap-x-4 rounded-xl border border-indigo-300 dark:border-gray-800 bg-white p-4 dark:bg-black">
      <div className="flex items-center gap-x-4">
        <Image
          src="/icons/EthValidator.svg"
          alt="Validator"
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

      <div className="flex items-center gap-1 p-2">
        <AlignLeft className="h-4 w-4" />
        <div className="text-sm">{depositAmount.toFixed(3)}</div>
      </div>

      <div className="flex items-center gap-3">
        <SecondaryButton
          icon={<Copy className="h-4 w-4" />}
          iconPosition={EIconPosition.LEFT}
          label="Deposit Data"
          onClick={() => {}}
          disabled={false}
        />

        <PrimaryButton label="Add" onClick={() => {}} disabled={false} />
      </div>
    </div>
  );
};
