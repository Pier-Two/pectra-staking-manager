"use client";

import type { FC } from "react";
import { useTheme } from "pec/hooks/useTheme";
import Image from "next/image";

export const Footer: FC = () => {
  const { darkMode } = useTheme();
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">Brought to you by:</div>
      <div className="flex flex-row gap-8">
        <Image
          src={`/logos/${darkMode ? "dark" : "light"}/PierTwo.svg`}
          alt="Pier Two"
          width={200}
          height={200}
        />

        <Image
          src={`/logos/${darkMode ? "dark" : "light"}/Labrys.svg`}
          alt="Pier Two"
          width={200}
          height={200}
        />

        <Image
          src={`/logos/${darkMode ? "dark" : "light"}/Hashlock.svg`}
          alt="Pier Two"
          width={200}
          height={200}
        />
      </div>
    </div>
  );
};
