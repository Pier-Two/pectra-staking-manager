import type { Metadata } from "next";
import { ChartPrefetch } from "pec/components/charts/ChartPrefetch";
import { ChartSkeleton } from "pec/components/charts/ChartSkeleton";
import { title } from "pec/constants/metadata";
import { Suspense, type FC } from "react";

export const metadata: Metadata = {
  title: title("Charts"),
  description: "Visualise Ethereum's greatest ever validator upgrade.",
};

const ChartsPage: FC = () => {
  return (
    <div className="flex w-full flex-col items-center dark:text-white">
      <div className="flex w-full flex-1 flex-col space-y-10 p-10">
        <div className="flex flex-col items-center gap-4">
          <div className="text-3xl font-medium">
            Ethereum&apos;s Pectra Upgrade
          </div>

          <div className="text-base">
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
