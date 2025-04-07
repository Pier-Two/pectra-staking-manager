import type { FC } from "react";
import { Merge } from "lucide-react";
import { Skeleton } from "pec/components/ui/skeleton";

const ConsolidationLoading: FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-x-4">
          <Merge className="h-10 w-10 rotate-90 text-yellow-500" />
          <div className="text-3xl">Consolidate</div>
        </div>
        <div className="w-[40vw] text-center text-gray-700">
          Combine multiple validator balances into a single large-balance
          validator, as per Pectra EIP-7251.
        </div>

        {/* Skeleton loaders for async data */}
        <div className="space-y-4">
          <Skeleton className="h-12 w-[60vw] rounded-md bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-12 w-[40vw] rounded-md bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-12 w-[50vw] rounded-md bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-12 w-[40vw] rounded-md bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-12 w-[60vw] rounded-md bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  );
};

export default ConsolidationLoading;
