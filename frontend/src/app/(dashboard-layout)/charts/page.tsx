"use client";

import type { FC } from "react";
import { api } from "pec/trpc/react";
import ChartLoading from "./loading";
import { ChartContainer } from "pec/components/charts/ChartContainer";
import type { IChartContainer } from "pec/types/chart";

const ChartsPage: FC = () => {
  const { data, isFetched } = api.charts.getChartData.useQuery();
  if (!data || !isFetched) return <ChartLoading />;
  const chartContainer = data as IChartContainer;

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

        <ChartContainer charts={chartContainer.charts} />
      </div>
    </div>
  );
};

export default ChartsPage;
