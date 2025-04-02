"use client";

import type { FC } from "react";
import { useTheme } from "pec/hooks/useTheme";
import Image from "next/image";

export const Footer: FC = () => {
  const { darkMode } = useTheme();

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row gap-20 text-gray-500 dark:text-gray-400">
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm">Product by</div>
          <Image
            src={`/logos/${darkMode ? "dark" : "light"}/PierTwo.svg`}
            alt="Pier Two"
            width={200}
            height={200}
          />
          <div className="text-sm">Onchain infrastructure</div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm">Produced by</div>
          <Image
            src={`/logos/${darkMode ? "dark" : "light"}/LabrysHover.svg`}
            alt="Labrys"
            width={200}
            height={200}
          />
          <div className="text-sm">Onchain developers</div>
        </div>
      </div>
    </div>
  );
};
