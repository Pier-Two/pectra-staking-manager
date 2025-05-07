"use client";

import { useState, type FC } from "react";
import { api } from "pec/trpc/react";
import Image from "next/image";
import { Card, CardFooter, CardHeader } from "pec/components/ui/card";
import { AreaChartComponent } from "./AreaChart";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { ChartSkeleton } from "./ChartSkeleton";
import { Dialog, DialogContent } from "../ui/dialog";
import { cn } from "pec/lib/utils";
import { motion } from "motion/react";
import { ClingableElement } from "../ui/clingable-element";
import { BiaxialLineChartComponent } from "./BiaxialLineChart";

const emptyChart = (
  <Card className="w-full rounded-xl bg-white text-black shadow-xl dark:bg-gray-900 dark:text-white">
    <CardHeader className="flex flex-row items-center justify-between">
      <div className="">
        <div className="text-lg font-semibold">No charts configured.</div>
      </div>
    </CardHeader>
  </Card>
);

const ChartNavigation = ({
  isFullscreen,
  setIsFullscreen,
  handleChartBackward,
  handleChartForward,
}: {
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
  handleChartBackward: () => void;
  handleChartForward: () => void;
}) => (
  <div className="flex flex-row items-center gap-2">
    <ClingableElement className="rounded-full">
      <Expand
        className="h-10 w-10 cursor-pointer rounded-full border-2 p-2 hover:bg-white max-sm:h-8 max-sm:w-8 max-sm:p-1.5 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
        onClick={() => setIsFullscreen(!isFullscreen)}
      />
    </ClingableElement>
    <ClingableElement className="rounded-full">
      <ChevronLeft
        className="h-10 w-10 cursor-pointer rounded-full border-2 p-2 hover:bg-white max-sm:h-8 max-sm:w-8 max-sm:p-1.5 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
        onClick={handleChartBackward}
      />
    </ClingableElement>
    <ClingableElement className="rounded-full">
      <ChevronRight
        className="h-10 w-10 cursor-pointer rounded-full border-2 p-2 hover:bg-white max-sm:h-8 max-sm:w-8 max-sm:p-1.5 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
        onClick={handleChartForward}
      />
    </ClingableElement>
  </div>
);

export const ChartContainer: FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data, isFetched } = api.charts.getChartData.useQuery(undefined);

  const [chartIndex, setChartIndex] = useState(0);

  if (!data || !isFetched) return <ChartSkeleton />;

  const chartCount = data.length;

  const activeChart = data[chartIndex];

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

  const ChartStuff = ({ isFullscreen }: { isFullscreen: boolean }) => (
    <motion.div
      className={`flex w-full flex-col gap-4 bg-indigo-50 dark:bg-gray-950`}
      layoutId="chart-container"
    >
      <div className="flex flex-row items-center justify-between gap-12 px-6 max-sm:flex-col max-sm:items-center max-sm:gap-4 max-sm:px-4">
        <div className="text-center text-[24px] font-670 text-zinc-950 max-sm:text-[16px] dark:text-zinc-50">
          {title}
        </div>

        {chartCount > 1 && (
          <div className="flex flex-row items-center gap-8 max-sm:hidden">
            <ChartNavigation
              isFullscreen={isFullscreen}
              setIsFullscreen={setIsFullscreen}
              handleChartBackward={handleChartBackward}
              handleChartForward={handleChartForward}
            />
          </div>
        )}
      </div>

      <Card
        className={`w-full rounded-xl bg-white text-black shadow-xl dark:border dark:border-gray-800 dark:bg-gray-900 dark:text-white`}
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

        <div
          className={cn(
            "flex h-[400px] w-full items-center justify-center px-4 sm:px-8",
            isFullscreen && "h-[calc(100vh-235px)] sm:h-[calc(100vh-220px)]",
          )}
        >
          {activeChart.type === "area" ? (
            <AreaChartComponent chart={activeChart} />
          ) : (
            <BiaxialLineChartComponent chart={activeChart} />
          )}
        </div>

        {footer && (
          <CardFooter className="flex flex-row items-center justify-center text-[14px] font-380 text-zinc-950 max-sm:text-[12px] dark:text-zinc-50">
            {footer}
          </CardFooter>
        )}
        {chartCount > 1 && (
          <div className="flex flex-row items-center justify-center gap-4 px-4 pb-4 sm:hidden">
            <ChartNavigation
              isFullscreen={isFullscreen}
              setIsFullscreen={setIsFullscreen}
              handleChartBackward={handleChartBackward}
              handleChartForward={handleChartForward}
            />
          </div>
        )}
      </Card>
    </motion.div>
  );

  return (
    <>
      <ChartStuff isFullscreen={false} />
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent
          className="h-screen w-screen max-w-none rounded-none bg-indigo-50 pt-4 max-sm:p-2 sm:rounded-none sm:p-4 dark:bg-gray-950"
          noClose
        >
          <ChartStuff isFullscreen={true} />
        </DialogContent>
      </Dialog>
    </>
  );
};
