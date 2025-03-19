import type { FC } from "react";
import { ProgressBar } from "pec/components/consolidation/ProgressBar";
import { Skeleton } from "pec/components/ui/skeleton";

const ConsolidationWorkflowLoading: FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <ProgressBar progress={1} />

      <div className="space-y-8">
        <div className="space-y-4">
          <div className="text-3xl">Loading validators...</div>
          <div className="text-md text-gray-700 dark:text-gray-300">
            We&apos;re loading your validators...
          </div>
        </div>
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
  );
};

export default ConsolidationWorkflowLoading;
