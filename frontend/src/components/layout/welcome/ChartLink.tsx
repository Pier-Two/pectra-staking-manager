"use client";

import type { FC } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight, Circle } from "lucide-react";

import type { IChartLink } from "pec/types/welcome";

export const ChartLink: FC<IChartLink> = (props) => {
  const { numberOfUpgrades, upgradePercentage } = props;
  const router = useRouter();

  const handleChartNavigation = () => {
    router.push("/charts");
  };

  return (
    <div
      className="flex w-full flex-row items-center justify-between rounded-xl border border-gray-300 bg-white p-4 hover:cursor-pointer hover:bg-gray-100 dark:border-gray-800 dark:bg-black dark:hover:bg-gray-900"
      onClick={handleChartNavigation}
    >
      <div className="flex flex-row gap-4">
        <Image
          src="/icons/ChartTrend.svg"
          alt="Wallet"
          width={24}
          height={24}
        />
        <div className="flex flex-col">
          <div>Pectra uptake by validators</div>
          <div className="flex flex-row items-center gap-2">
            <Circle className="h-3 w-3 fill-green-500 text-white dark:fill-green-500 dark:text-black" />
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {numberOfUpgrades} upgraded ({upgradePercentage}%)
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center gap-2">
        <div className="text-sm text-indigo-600 dark:text-indigo-300">
          View charts
        </div>
        <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-300" />
      </div>
    </div>
  );
};
