import type { FC } from "react";
import type { IActiveValidators } from "pec/types/dashboard";
import Image from "next/image";

export const ActiveValidators: FC<IActiveValidators> = (props) => {
  const { activeValidators, inactiveValidators } = props;
  return (
    <div className="space-y-4 rounded-xl border bg-indigo-50 p-4 pe-8 ps-8 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white">
      <div className="flex flex-row items-center justify-between gap-8">
        <div>Active Validators</div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
          <Image
            src="/icons/EthValidator.svg"
            alt="Wallet"
            width={24}
            height={24}
          />
          <div className="text-xl font-bold text-indigo-800 dark:text-indigo-200">
            {activeValidators}
          </div>
        </div>

        {inactiveValidators > 0 && (
          <div className="text-sm">+{inactiveValidators} inactive</div>
        )}
      </div>
    </div>
  );
};
