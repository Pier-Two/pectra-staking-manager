import type { FC } from "react";
import { Merge } from "lucide-react";
import { Skeleton } from "pec/components/ui/skeleton";

const ConsolidationLoading: FC = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-x-4">
          <Merge className="h-10 w-10 rotate-90 text-yellow-500" />
          <div className="text-3xl">Consolidate</div>
        </div>
        <div className="text-Zinc-50 text-sm">
          Combine multiple validator balances into a single large-balance
          validator, as per Pectra EIP-7251.
        </div>

        {/* Skeleton loaders for async data */}
        <div className="flex w-full flex-col space-y-4">
          <Skeleton className="h-12 w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-12 w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-12 w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-12 w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-12 w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  );
};

export default ConsolidationLoading;
