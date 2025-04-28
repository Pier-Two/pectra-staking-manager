import { ArrowUpFromDot } from "lucide-react";
import type { FC } from "react";

const WithdrawalLoading: FC = () => {
  return (
    <div className="mx-auto w-full animate-pulse space-y-8">
      <div className="flex gap-x-4 text-primary-dark dark:text-indigo-200">
        <ArrowUpFromDot className="h-8 w-8 self-center" />
        <div className="text-2xl font-medium">Withdrawal</div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex gap-x-4 text-primary-dark dark:text-indigo-200">
          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700" />
          <div className="h-8 w-40 rounded bg-gray-300 dark:bg-gray-700" />
        </div>

        <div className="h-6 rounded bg-gray-300 dark:bg-gray-700" />
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
