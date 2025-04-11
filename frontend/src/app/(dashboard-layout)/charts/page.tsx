"use client";

import type { FC } from "react";
import { ChartContainer } from "pec/components/charts/ChartContainer";

const ChartsPage: FC = () => {
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

        <ChartContainer />
      </div>
    </div>
  );
};

export default ChartsPage;
