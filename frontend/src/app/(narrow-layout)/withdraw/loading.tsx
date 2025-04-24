import { ArrowUpFromDot } from "lucide-react";
import type { FC } from "react";

const WithdrawalLoading: FC = () => {
  return (
    <div className="w-full animate-pulse space-y-8">
      <div className="flex gap-x-4 text-indigo-800 dark:text-indigo-300">
        <ArrowUpFromDot className="h-10 w-10" />
        <div className="text-3xl">Partial Withdrawal</div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex gap-x-4 text-indigo-800 dark:text-indigo-300">
          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700" />
          <div className="h-8 w-40 rounded bg-gray-300 dark:bg-gray-700" />
        </div>

        <div className="h-6 w-[45vw] rounded bg-gray-300 dark:bg-gray-700" />
      </div>

      <div className="space-y-4">
        <div className="h-12 rounded bg-gray-300 dark:bg-gray-700" />
        <div className="h-40 rounded bg-gray-300 dark:bg-gray-700" />
        <div className="h-10 rounded bg-gray-300 dark:bg-gray-700" />
      </div>

      <div className="space-y-4">
        <div className="h-12 rounded bg-gray-300 dark:bg-gray-700" />
        <div className="h-40 rounded bg-gray-300 dark:bg-gray-700" />
        <div className="h-10 rounded bg-gray-300 dark:bg-gray-700" />
      </div>
    </div>
  );
};

export default WithdrawalLoading;
