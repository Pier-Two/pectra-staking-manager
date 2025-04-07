import type { FC } from "react";
import { AlignLeft } from "lucide-react";

export const TotalDailyIncome: FC = () => {
  return (
    <div className="space-y-4 rounded-xl border bg-indigo-50 p-4 pe-8 ps-8 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white">
      <div className="flex flex-row items-center justify-between gap-8">
        <div>Total Daily Income</div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-1 text-indigo-800 dark:text-indigo-200">
          <AlignLeft />
          <div className="text-xl font-bold">
            XXX
          </div>
        </div>

        <div className="text-sm">
          Earning XXX per day
        </div>
      </div>
    </div>
  );
};
