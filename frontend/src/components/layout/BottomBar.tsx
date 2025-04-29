"use client";

import Image from "next/image";
import { logoPaths } from "pec/constants/logo";
import { labrysUrl, openInNewTab, pierTwoUrl } from "pec/helpers/getExternalLink";
import { useTheme } from "pec/hooks/useTheme";
import { cn } from "pec/lib/utils";
import { EThemeMode } from "pec/types/theme";
import type { FC } from "react";

interface RenderLogoProps {
  grayscale?: boolean;
  logo: "PierTwo" | "Labrys";
  width: number;
  height: number;
}

export const RenderLogo = ({ logo, grayscale = false, width, height }: RenderLogoProps) => {
  const { darkMode } = useTheme();
  const mode: EThemeMode = darkMode ? EThemeMode.DARK : EThemeMode.LIGHT;
  const currentLogo = logoPaths[logo];
  if (!currentLogo) return null;

  const logoSrc = currentLogo[mode] ?? "";

  return (
    <div className="group relative">
      <Image
        src={logoSrc}
        alt={logo}
        className={cn({
          "transition-grayscale grayscale duration-200 group-hover:grayscale-0": grayscale,
        })}
        width={width}
        height={height}
      />
    </div>
  );
};

export const BottomBar: FC = () => {
  return (
    <footer className="fixed bottom-0 z-10 flex flex-col sm:flex-row p-4 w-full items-center justify-center sm:justify-between border-t gap-y-4 bg-[rgba(255,255,255,0.98)] px-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="text-[11px] leading-[11px] text-zinc-950 dark:text-gray-300 text-center sm:text-left">
        Built with 🩶 by and for the Ethereum community
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-sm text-gray-600 dark:text-gray-300 hover:cursor-pointer" onClick={() => openInNewTab(pierTwoUrl)}>
        <div className="flex flex-wrap items-center justify-center gap-x-3">
          <p className="text-[11px] leading-[11px] text-zinc-950 dark:text-gray-300">
            Product by:
          </p>
          <RenderLogo logo="PierTwo" grayscale={true} width={100} height={100} />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-3 hover:cursor-pointer" onClick={() => openInNewTab(labrysUrl)}>
          <p className="text-[11px] leading-[11px] text-zinc-950 dark:text-gray-300">
            Produced by:{" "}
          </p>
          <RenderLogo logo="Labrys" grayscale={true} width={100} height={100} />
        </div>
      </div>
    </footer>
  );
};
