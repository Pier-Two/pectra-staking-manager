import type { FC } from "react";
import { AlignLeft } from "lucide-react";
import type { IGenericValidators } from "pec/types/validator";
import { DECIMAL_PLACES } from "pec/lib/constants";
import { formatEther } from "viem";

export const TotalStake: FC<IGenericValidators> = (props) => {
  const { validators } = props;
  const totalStake = validators.reduce(
    (acc, validator) => acc + validator.balance,
    0n,
  );
  const averageStake = totalStake / BigInt(validators.length);

  return (
    <div className="space-y-4 rounded-xl border bg-indigo-50 p-4 pe-8 ps-8 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white">
      <div className="flex flex-row items-center justify-between gap-8">
        <div>Total ETH Staked</div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-1 text-indigo-800 dark:text-indigo-200">
          <AlignLeft />
          <div className="text-xl font-bold">
            {Number(formatEther(totalStake)).toFixed(DECIMAL_PLACES)}
          </div>
        </div>

        <div className="text-sm">
          Average {Number(formatEther(averageStake)).toFixed(DECIMAL_PLACES)}{" "}
          per validator
        </div>
      </div>
    </div>
  );
};
