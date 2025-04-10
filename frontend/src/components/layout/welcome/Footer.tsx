"use client";

import Image from "next/image";
import { useTheme } from "pec/hooks/useTheme";
import type { FC } from "react";

export const Footer: FC = () => {
  const { darkMode } = useTheme();

  return (
    <div className="mt-9 flex flex-col items-center text-xs">
      <div className="flex flex-row gap-20 text-gray-500 dark:text-gray-400">
        <div className="flex flex-col items-center gap-y-3">
          <div className="text-[11px] leading-[11px] text-zinc-600">
            Product by
          </div>
          <Image
            src={`/logos/${darkMode ? "dark" : "light"}/PierTwo.svg`}
            alt="Pier Two"
            width={999}
            height={999}
            className="h-6 w-[124.24px]"
          />
          <div className="text-[11px] leading-[11px] text-zinc-600">
            Onchain infrastructure
          </div>
        </div>

        <div className="flex flex-col items-center gap-y-3">
          <div className="text-[11px] leading-[11px] text-zinc-600">
            Produced by
          </div>
          <Image
            src={`/logos/${darkMode ? "dark" : "light"}/LabrysHover.svg`}
            alt="Labrys"
            width={999}
            height={999}
            className="h-6 w-[124.24px]"
          />
          <div className="text-[11px] leading-[11px] text-zinc-600">
            Onchain developers
          </div>
        </div>
      </div>
    </div>
  );
};
