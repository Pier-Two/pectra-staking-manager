import type { FC } from "react";
import { Skeleton } from "pec/components/ui/skeleton";

const ChartLoading: FC = () => {
  return (
    <div className="flex w-full flex-col items-center dark:text-white">
      <div className="flex w-[55vw] flex-col space-y-10 p-10">
        <div className="space-y-2">
          <div className="flex items-center justify-center text-2xl font-medium">
            Ethereum&apos;s Pectra Upgrade
          </div>

          <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            Visualise Ethereum&apos;s greatest ever validator upgrade.
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-12 w-[55vw] rounded-md bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-12 w-[40vw] rounded-md bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-12 w-[50vw] rounded-md bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-12 w-[20vw] rounded-md bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-12 w-[55vw] rounded-md bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-12 w-[55vw] rounded-md bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-12 w-[40vw] rounded-md bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-12 w-[50vw] rounded-md bg-gray-200 dark:bg-gray-800" />
        </div>{" "}
      </div>
    </div>
  );
};

export default ChartLoading;
