import type { FC } from "react";
import { Skeleton } from "pec/components/ui/skeleton";

const ChartLoading: FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-x-4">
          <div className="text-3xl">Charts</div>
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

export default ChartLoading;
