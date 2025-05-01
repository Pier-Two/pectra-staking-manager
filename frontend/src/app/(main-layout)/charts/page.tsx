import type { Metadata } from "next";
import { ChartPrefetch } from "pec/components/charts/ChartPrefetch";
import { ChartSkeleton } from "pec/components/charts/ChartSkeleton";
import { title } from "pec/constants/metadata";
import { Suspense, type FC } from "react";

export const metadata: Metadata = {
  title: title("Charts"),
};

const ChartsPage: FC = () => {
  return (
    <div className="flex w-full flex-col items-center dark:text-white">
      <div className="flex w-[100vw] flex-col space-y-10 p-10 md:w-[55vw]">
        <div className="space-y-2">
          <div className="flex items-center justify-center text-2xl font-medium text-zinc-950 dark:text-zinc-50">
            Ethereum&apos;s Pectra Upgrade
          </div>

          <div className="flex items-center justify-center text-sm text-zinc-400 dark:text-zinc-400">
            Visualise Ethereum&apos;s greatest ever validator upgrade.
          </div>
        </div>

        <Suspense fallback={<ChartSkeleton />}>
          <ChartPrefetch />
        </Suspense>
      </div>
    </div>
  );
};

export default ChartsPage;
