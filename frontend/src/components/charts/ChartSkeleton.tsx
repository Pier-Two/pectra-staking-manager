import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Card, CardHeader } from "pec/components/ui/card";
import { Skeleton } from "pec/components/ui/skeleton";

export const ChartSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-row items-center justify-between px-6">
        <div className="text-lg font-semibold">
          Pectra adoption across all validators
        </div>

        <div className="flex flex-row items-center gap-8">
          <div className="flex flex-row items-center gap-4 text-sm">
            <p>Day</p>
            <p>Month</p>
            <p>Year</p>
          </div>

          <div className="flex flex-row items-center gap-2">
            <ChevronLeft className="h-10 w-10 rounded-full border-2 p-2 dark:border-gray-800 dark:bg-gray-900" />
            <ChevronRight className="h-10 w-10 rounded-full border-2 p-2 dark:border-gray-800 dark:bg-gray-900" />
          </div>
        </div>
      </div>

      <Card className="w-full rounded-xl bg-white text-black shadow-xl dark:border dark:border-gray-800 dark:bg-gray-900 dark:text-white">
        <CardHeader className="flex flex-row justify-end">
          <div className="flex flex-row items-center gap-2">
            <Image
              src="/icons/EthValidator.svg"
              alt="Wallet"
              width={18}
              height={18}
            />
            <p className="text-sm leading-[16px]">pectrastaking.com</p>
          </div>
        </CardHeader>

        <div className="flex w-full flex-col items-center justify-center gap-2 p-4">
          <div className="flex w-full flex-row items-center gap-2">
            <Skeleton className="h-64 w-6 rounded-xl bg-gray-300 dark:bg-gray-800" />
            <Skeleton className="h-64 w-full rounded-xl bg-gray-300 dark:bg-gray-800" />
          </div>
          <Skeleton className="h-6 w-full rounded-xl bg-gray-300 dark:bg-gray-800" />
        </div>
      </Card>
    </div>
  );
};
