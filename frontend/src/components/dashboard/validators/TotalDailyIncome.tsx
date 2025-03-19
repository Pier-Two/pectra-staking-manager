import type { FC } from "react";
import { AlignLeft, CircleDollarSign } from "lucide-react";

export const TotalDailyIncome: FC = () => {
  return (
    <div className="space-y-4 rounded-xl border bg-white p-4 pe-8 ps-8 dark:border-gray-800 dark:bg-black">
      <div className="flex flex-row items-center justify-between gap-8">
        <div>Total Daily Income</div>
        <CircleDollarSign className="h-4 w-4" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center">
          <AlignLeft />
          <div className="text-xl font-bold text-gray-700 dark:text-white">
            XXX
          </div>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Earning XXX per day
        </div>
      </div>
    </div>
  );
};
