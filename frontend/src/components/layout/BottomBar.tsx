"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { logoPaths, LogoType } from "pec/constants/logo";
import {
  espUrl,
  ethFoundationUrl,
  labrysUrl,
  pierTwoUrl,
} from "pec/helpers/getExternalLink";

import { cn } from "pec/lib/utils";
import { EThemeMode } from "pec/types/theme";
import type { FC } from "react";
import { useLocalStorage } from "usehooks-ts";

interface RenderLogoProps {
  grayscale?: boolean;
  logo: LogoType;
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
    <div className="relative">
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
    logo: LogoType;
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
    {
      logo: "ETHFoundation",
      text: "Sponsored by",
      redirectUrl: ethFoundationUrl,
    },
    {
      logo: "ESP",
      text: "Sponsored by",
      redirectUrl: espUrl,
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCookieConsent] = useLocalStorage<boolean | null>(
    "cookieConsent",
    null,
  );

  const Policies = () => (
    <>
      <Link
        href="/privacy-policy"
        className="text-xs leading-[11px] text-zinc-950 dark:text-gray-300"
      >
        Privacy Policy
      </Link>
      <Link
        href="/terms-of-use"
        className="text-xs leading-[11px] text-zinc-950 dark:text-gray-300"
      >
        Terms of Use
      </Link>
      <div
        onClick={() => setCookieConsent(null)}
        className="cursor-pointer text-xs leading-[11px] text-zinc-950 dark:text-gray-300"
      >
        Cookie Settings
      </div>
    </>
  );

  return (
    <footer className="fixed bottom-0 z-10 flex w-full flex-col items-center justify-center gap-y-4 border-t bg-[rgba(255,255,255,0.98)] p-4 px-6 shadow-sm lg:flex-row lg:justify-between dark:border-gray-800 dark:bg-gray-950">
      <div className="group pr-4 text-center text-xs leading-[11px] text-zinc-950 lg:text-left dark:text-gray-300">
        Built with <span className="group-hover:hidden">🩶</span>
        <span className="hidden group-hover:inline">❤️</span> by and for the
        Ethereum community
      </div>

      <div className="hidden flex-row items-center gap-x-4 lg:flex">
        <Policies />
      </div>

      <div className="flex flex-row items-center justify-around gap-4">
        {items.map((item) => (
          <Link
            href={item.redirectUrl}
            target="_blank"
            className="group flex flex-wrap items-center justify-center gap-x-3 gap-y-2 hover:cursor-pointer"
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

      <div className="flex flex-row gap-x-4 lg:hidden">
        <Policies />
      </div>
    </footer>
  );
};
