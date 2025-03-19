import type { FC } from "react";
import { AlignLeft, CircleDollarSign } from "lucide-react";
import type { IGenericValidators } from "pec/types/validator";

export const TotalStake: FC<IGenericValidators> = (props) => {
  const { validators } = props;
  const totalStake = validators.reduce(
    (acc, validator) => acc + validator.balance,
    0,
  );
  const averageStake = totalStake / validators.length;

  return (
    <div className="space-y-4 rounded-xl border bg-white p-4 pe-8 ps-8 dark:border-gray-800 dark:bg-black">
      <div className="flex flex-row items-center justify-between gap-8">
        <div>Total ETH Staked</div>
        <CircleDollarSign className="h-4 w-4" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center">
          <AlignLeft />
          <div className="text-xl font-bold text-gray-700 dark:text-white">
            {totalStake.toFixed(3)}
          </div>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Average {averageStake.toFixed(3)} per validator
        </div>
      </div>
    </div>
  );
};
