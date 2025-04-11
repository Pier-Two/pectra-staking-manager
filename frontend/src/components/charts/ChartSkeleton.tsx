import { Card, CardFooter, CardHeader } from "pec/components/ui/card";
import { Skeleton } from "pec/components/ui/skeleton";

export const ChartSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-row items-center justify-between px-6">
        <Skeleton className="h-6 w-32 rounded-xl bg-gray-300 dark:bg-gray-800" />{" "}
        {/* Title Skeleton */}
        <div className="flex flex-row items-center gap-8">
          <div className="flex flex-row items-center gap-4">
            <Skeleton className="h-5 w-10 rounded-xl bg-gray-300 dark:bg-gray-800" />
            <Skeleton className="h-5 w-14 rounded-xl bg-gray-300 dark:bg-gray-800" />
            <Skeleton className="h-5 w-10 rounded-xl bg-gray-300 dark:bg-gray-800" />
          </div>
          <div className="flex flex-row items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-800" />
            <Skeleton className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-800" />
          </div>
        </div>
      </div>

      <Card className="w-full rounded-xl bg-white text-black shadow-xl dark:border dark:border-gray-800 dark:bg-gray-900 dark:text-white">
        <CardHeader className="flex flex-row justify-end">
          <div className="flex flex-row items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-800" />
            <Skeleton className="h-4 w-32 rounded-xl bg-gray-300 dark:bg-gray-800" />
          </div>
        </CardHeader>

        <div className="flex w-full items-center justify-center p-4">
          <Skeleton className="h-64 w-full rounded-xl bg-gray-300 dark:bg-gray-800" />
        </div>

        <CardFooter className="flex flex-row items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          <Skeleton className="h-4 w-24 rounded-xl bg-gray-300 dark:bg-gray-800" />
        </CardFooter>
      </Card>
    </div>
  );
};
