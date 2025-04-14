"use client";

import { useState, type FC } from "react";
import { api } from "pec/trpc/react";
import Image from "next/image";
import { Card, CardFooter, CardHeader } from "pec/components/ui/card";
import { AreaChartComponent } from "./AreaChart";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ChartSkeleton } from "./ChartSkeleton";
import type { ChartGroup } from "pec/types/chart";

const emptyChart = (
  <Card className="w-full rounded-xl bg-white text-black shadow-xl dark:bg-gray-900 dark:text-white">
    <CardHeader className="flex flex-row items-center justify-between">
      <div className="">
        <div className="text-lg font-semibold">No charts configured.</div>
      </div>
    </CardHeader>
  </Card>
);

export const ChartContainer: FC = () => {
  const [filter, setFilter] = useState<"days" | "months" | "years">("days");
  const { data, isFetched } = api.charts.getChartData.useQuery(undefined, {
    refetchInterval: 10000,
  });
  
  const [chartIndex, setChartIndex] = useState(0);

  if (!data || !isFetched) return <ChartSkeleton />;

  const chartCount = data.length;
  const activeChartGroup = data.find(
    (chart) => chart.key === filter,
  ) as ChartGroup;
  const activeChart = activeChartGroup.data[chartIndex];

  const handleChartForward = () => {
    if (chartIndex === data.length - 1) setChartIndex(0);
    else setChartIndex(chartIndex + 1);
  };

  const handleChartBackward = () => {
    if (chartIndex === 0) setChartIndex(data.length - 1);
    else setChartIndex(chartIndex - 1);
  };

  if (!activeChart || chartCount === 0) return emptyChart;
  const { title, footer } = activeChart;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-row items-center justify-between px-6">
        <div className="text-lg font-semibold">{title}</div>
        {chartCount > 1 && (
          <div className="flex flex-row items-center gap-8">
            <div className="flex flex-row items-center gap-4 text-sm">
              <div
                onClick={() => setFilter("days")}
                className={`cursor-pointer ${filter === "days" ? "font-semibold text-indigo-500" : ""}`}
              >
                Day
              </div>

              <div
                onClick={() => setFilter("months")}
                className={`cursor-pointer ${filter === "months" ? "font-semibold text-indigo-500" : ""}`}
              >
                Month
              </div>

              <div
                onClick={() => setFilter("years")}
                className={`cursor-pointer ${filter === "years" ? "font-semibold text-indigo-500" : ""}`}
              >
                Year
              </div>
            </div>

            <div className="flex flex-row items-center gap-2">
              <ChevronLeft
                className="h-10 w-10 cursor-pointer rounded-full border-2 p-2 hover:bg-white dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
                onClick={handleChartBackward}
              />
              <ChevronRight
                className="h-10 w-10 cursor-pointer rounded-full border-2 p-2 hover:bg-white dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
                onClick={handleChartForward}
              />
            </div>
          </div>
        )}
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
            <div className="text-sm leading-[16px]">pectrastaking.com</div>
          </div>
        </CardHeader>

        <div className="flex w-full items-center justify-center">
          <AreaChartComponent chart={activeChart} />
        </div>

        {footer && (
          <CardFooter className="flex flex-row items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            {footer}
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
