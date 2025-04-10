"use client";

import { useState, type FC } from "react";
import { api } from "pec/trpc/react";
import ChartLoading from "./loading";
import { ChartContainer } from "pec/components/charts/ChartContainer";

const ChartsPage: FC = () => {
  const [filter, setFilter] = useState<"days" | "months" | "years">("days");
  const { data, isFetched } = api.charts.getChartData.useQuery(
    {
      filter,
    },
    { refetchInterval: 5000 },
  );
  
  if (!data || !isFetched) return <ChartLoading />;

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

        <ChartContainer charts={data} filter={filter} setFilter={setFilter} />
      </div>
    </div>
  );
};

export default ChartsPage;
