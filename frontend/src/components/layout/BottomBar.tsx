"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { logoPaths } from "pec/constants/logo";
import { labrysUrl, pierTwoUrl } from "pec/helpers/getExternalLink";

import { cn } from "pec/lib/utils";
import { EThemeMode } from "pec/types/theme";
import type { FC } from "react";

interface RenderLogoProps {
  grayscale?: boolean;
  logo: "PierTwo" | "Labrys";
  width: number;
  height: number;
}

export const RenderLogo = ({
  logo,
  grayscale = false,
  width,
  height,
}: RenderLogoProps) => {
  const { resolvedTheme: theme } = useTheme();
  const mode: EThemeMode =
    theme === "dark" ? EThemeMode.DARK : EThemeMode.LIGHT;
  const currentLogo = logoPaths[logo];
  if (!currentLogo) return null;

  const logoSrc = currentLogo[mode] ?? "";

  return (
    <div className="group relative">
      <Image
        src={logoSrc}
        alt={logo}
        className={cn({
          "transition-grayscale grayscale duration-200 group-hover:grayscale-0":
            grayscale,
        })}
        width={width}
        height={height}
      />
    </div>
  );
};

export const BottomBar: FC = () => {
  const items: {
    logo: "PierTwo" | "Labrys";
    text: string;
    redirectUrl: string;
  }[] = [
    {
      logo: "PierTwo",
      text: "Product by",
      redirectUrl: pierTwoUrl,
    },
    {
      logo: "Labrys",
      text: "Produced by",
      redirectUrl: labrysUrl,
    },
  ];

  return (
    <footer className="fixed bottom-0 z-10 flex w-full flex-col items-center justify-center gap-y-4 border-t bg-[rgba(255,255,255,0.98)] p-4 px-6 shadow-sm sm:flex-row sm:justify-between dark:border-gray-800 dark:bg-gray-950">
      <div className="text-center text-xs leading-[11px] text-zinc-950 sm:text-left dark:text-gray-300">
        Built with 🩶 by and for the Ethereum community
      </div>

      <div className="flex flex-row gap-x-4">
        <Link
          href="/privacy-policy"
          className="text-xs leading-[11px] text-zinc-950 dark:text-gray-300"
        >
          Privacy Policy
        </Link>
        <Link
          href="/terms-of-service"
          className="text-xs leading-[11px] text-zinc-950 dark:text-gray-300"
        >
          Terms of Service
        </Link>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
        {items.map((item) => (
          <Link
            href={item.redirectUrl}
            target="_blank"
            className="flex flex-wrap items-center justify-center gap-x-3 hover:cursor-pointer"
            key={item.logo}
          >
            <p className="text-xs leading-[11px] text-zinc-950 dark:text-gray-300">
              {item.text}
            </p>
            <RenderLogo
              logo={item.logo}
              grayscale={true}
              width={100}
              height={100}
            />
          </Link>
        ))}
      </div>
    </footer>
  );
};
