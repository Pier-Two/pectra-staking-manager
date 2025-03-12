"use client";

import type { FC } from "react";
import Image from "next/image";
import { useTheme } from "pec/hooks/useTheme";
import { EThemeMode } from "pec/types/theme";
import { logoPaths } from "pec/constants/logo"; // Import logoPaths

export const BottomBar: FC = () => {
  const { darkMode } = useTheme();
  const mode: EThemeMode = darkMode ? EThemeMode.DARK : EThemeMode.LIGHT;

  const renderLogo = (logo: string) => {
    const currentLogo = logoPaths[logo];
    if (!currentLogo) return null;

    const logoSrc = currentLogo[mode] ?? "";
    const hoverLogoSrc: string =
      currentLogo[
        `hover${mode.charAt(0).toUpperCase() + mode.slice(1)}` as EThemeMode
      ] ?? "";

    return (
      <div className="group relative">
        <Image
          src={logoSrc}
          alt={logo}
          className="h-30 w-30 transition-opacity duration-200 group-hover:opacity-0"
          width={100}
          height={100}
        />

        <Image
          src={hoverLogoSrc}
          alt={`${logo} Hover`}
          className="h-30 w-30 absolute left-0 top-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          width={100}
          height={100}
        />
      </div>
    );
  };

  return (
    <footer className="sticky bottom-0 z-10 flex h-[5vh] w-full items-center justify-between border-t bg-[rgba(255,255,255,0.98)] px-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="text-gray-600 dark:text-gray-300">
        Built with 🤍 by and for the Ethereum community
      </div>

      <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
        <div>Powered by: </div>
        {renderLogo("PierTwo")}
        {renderLogo("Labrys")}
        {renderLogo("Hashlock")}
      </div>
    </footer>
  );
};
