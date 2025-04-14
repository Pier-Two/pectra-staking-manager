"use client";

import Image from "next/image";
import { logoPaths } from "pec/constants/logo"; // Import logoPaths
import { useTheme } from "pec/hooks/useTheme";
import { EThemeMode } from "pec/types/theme";
import type { FC } from "react";

export const BottomBar: FC = () => {
  const { darkMode } = useTheme();
  const mode: EThemeMode = darkMode ? EThemeMode.DARK : EThemeMode.LIGHT;

  const renderLogo = (logo: string) => {
    const currentLogo = logoPaths[logo];
    if (!currentLogo) return null;

    const logoSrc = currentLogo[mode] ?? "";

    return (
      <div className="group relative">
        <Image
          src={logoSrc}
          alt={logo}
          className="h-35 w-35 transition-grayscale grayscale duration-200 group-hover:grayscale-0"
          width={100}
          height={100}
        />
      </div>
    );
  };

  return (
    <footer className="sticky bottom-0 z-10 flex h-10 w-full items-center justify-between border-t bg-[rgba(255,255,255,0.98)] px-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="text-[11px] leading-[11px] text-zinc-950 dark:text-gray-300">
        Built with 🩶 by and for the Ethereum community
      </div>

      <div className="flex items-center gap-8 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex flex-wrap items-center gap-x-3">
          <p className="text-[11px] leading-[11px] text-zinc-950">
            Product by:
          </p>
          {renderLogo("PierTwo")}
        </div>

        <div className="flex flex-wrap items-center gap-x-3">
          <p className="text-[11px] leading-[11px] text-zinc-950">
            Produced by:{" "}
          </p>
          {renderLogo("Labrys")}
        </div>
      </div>
    </footer>
  );
};
