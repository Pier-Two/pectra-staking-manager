"use client";

import type { FC } from "react";
import { useTheme } from "pec/hooks/useTheme";
import Image from "next/image";

export const Footer: FC = () => {
  const { darkMode } = useTheme();

  return (
    <div className="flex flex-col items-center text-xs">
      <div className="flex flex-row gap-20 text-gray-500 dark:text-gray-400">
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs">Product by</div>
          <Image
            src={`/logos/${darkMode ? "dark" : "light"}/PierTwo.svg`}
            alt="Pier Two"
            width={100}
            height={100}
            className="min-h-[20px]"
          />
          <div className="text-xs">Onchain infrastructure</div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="text-xs">Produced by</div>
          <Image
            src={`/logos/${darkMode ? "dark" : "light"}/LabrysHover.svg`}
            alt="Labrys"
            width={100}
            height={100}
            className="min-h-[20px]"
          />
          <div className="text-xs">Onchain developers</div>
        </div>
      </div>
    </div>
  );
};
