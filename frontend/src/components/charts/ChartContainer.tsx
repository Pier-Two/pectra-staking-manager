"use client";

import type { FC } from "react";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";

import type { ChartGroup } from "pec/types/chart";
import { Card, CardFooter, CardHeader } from "pec/components/ui/card";
import { api } from "pec/trpc/react";

import { AreaChartComponent } from "./AreaChart";
import { ChartSkeleton } from "./ChartSkeleton";

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
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data, isFetched } = api.charts.getChartData.useQuery(undefined, {
    refetchInterval: 10000,
  });

  const [chartIndex, setChartIndex] = useState(0);

  if (!data || !isFetched) return <ChartSkeleton />;

  const chartCount = data.length;

  const activeChartGroup = data.find(
    (chart) => chart.key === filter,
  ) as ChartGroup;

  const activeChart = activeChartGroup?.data[chartIndex];

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
    <div
      className={`flex w-full flex-col gap-4 ${isFullscreen ? "fixed inset-0 z-50 bg-white p-4 dark:bg-gray-900" : ""}`}
    >
      <div className="flex flex-row items-center justify-between gap-12 px-6 max-sm:flex-col max-sm:items-center max-sm:gap-4 max-sm:px-4">
        <div className="text-center text-[24px] font-670 text-zinc-950 dark:text-zinc-50 max-sm:text-[16px]">
          {title}
        </div>

        {chartCount > 1 && (
          <div className="flex flex-row items-center gap-8 max-sm:gap-4">
            <div className="flex flex-row items-center gap-4 text-sm">
              <div
                onClick={() => setFilter("days")}
                className={`cursor-pointer ${filter === "days" ? "font-semibold text-indigo-500" : "text-zinc-950 dark:text-zinc-50"}`}
              >
                Day
              </div>

              <div
                onClick={() => setFilter("months")}
                className={`cursor-pointer ${filter === "months" ? "font-semibold text-indigo-500" : "text-zinc-950 dark:text-zinc-50"}`}
              >
                Month
              </div>

              <div
                onClick={() => setFilter("years")}
                className={`cursor-pointer ${filter === "years" ? "font-semibold text-indigo-500" : "text-zinc-950 dark:text-zinc-50"}`}
              >
                Year
              </div>
            </div>

            <div className="flex flex-row items-center gap-2">
              <Expand
                className="h-10 w-10 cursor-pointer rounded-full border-2 p-2 hover:bg-white dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800 max-sm:hidden"
                onClick={() => setIsFullscreen(!isFullscreen)}
              />

              <ChevronLeft
                className="h-10 w-10 cursor-pointer rounded-full border-2 p-2 hover:bg-white dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800 max-sm:h-8 max-sm:w-8 max-sm:p-1.5"
                onClick={handleChartBackward}
              />
              <ChevronRight
                className="h-10 w-10 cursor-pointer rounded-full border-2 p-2 hover:bg-white dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800 max-sm:h-8 max-sm:w-8 max-sm:p-1.5"
                onClick={handleChartForward}
              />
            </div>
          </div>
        )}
      </div>

      <Card
        className={`w-full rounded-xl bg-white text-black shadow-xl dark:border dark:border-gray-800 dark:bg-gray-900 dark:text-white ${isFullscreen ? "h-[calc(100vh-8rem)]" : ""}`}
      >
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
          <AreaChartComponent chart={activeChart} isFullscreen={isFullscreen} />
        </div>

        {footer && (
          <CardFooter className="flex flex-row items-center justify-center text-[14px] font-380 text-zinc-950 dark:text-zinc-50 max-sm:text-[12px]">
            {footer}
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
