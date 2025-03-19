import type { FC } from "react";
import { CircleDollarSign } from "lucide-react";
import type { IActiveValidators } from "pec/types/dashboard";
import Image from "next/image";
export const ActiveValidators: FC<IActiveValidators> = (props) => {
  const { activeValidators, inactiveValidators } = props;
  return (
    <div className="space-y-4 rounded-xl border bg-white p-4 pe-8 ps-8 dark:border-gray-800 dark:bg-black">
      <div className="flex flex-row items-center justify-between gap-8">
        <div>Active Validators</div>
        <CircleDollarSign className="h-4 w-4" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
          <Image
            src="/icons/EthValidator.svg"
            alt="Wallet"
            width={24}
            height={24}
          />
          <div className="text-xl font-bold text-gray-700 dark:text-white">
            {activeValidators}
          </div>
        </div>

        {inactiveValidators > 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            +{inactiveValidators} inactive
          </div>
        )}
      </div>
    </div>
  );
};
