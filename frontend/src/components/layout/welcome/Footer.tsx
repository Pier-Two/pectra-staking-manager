"use client";

import Image from "next/image";
import { EnterAnimation } from "pec/app/(login-layout)/welcome/_components/enter-animation";
import { welcomeAnimationDelays } from "pec/constants/animationDelays";
import { useTheme } from "pec/hooks/useTheme";
import type { FC } from "react";

export const Footer: FC = () => {
  const { darkMode } = useTheme();

  return (
    <div className="mt-9 flex flex-col items-center font-inter text-xs font-light">
      <div className="flex flex-row gap-20 text-gray-500 dark:text-gray-400">
        <EnterAnimation
          delay={welcomeAnimationDelays.footer.pierTwo}
          className="flex flex-col items-center gap-y-3"
        >
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
        </EnterAnimation>

        <EnterAnimation
          delay={welcomeAnimationDelays.footer.labrys}
          className="flex flex-col items-center gap-y-3"
        >
          <div className="text-[11px] leading-[11px] text-zinc-600">
            Produced by
          </div>
          <Image
            src={`/logos/${darkMode ? "dark" : "light"}/Labrys.svg`}
            alt="Labrys"
            width={999}
            height={999}
            className="h-6 w-[124.24px]"
          />
          <div className="text-[11px] leading-[11px] text-zinc-600">
            Onchain developers
          </div>
        </EnterAnimation>
      </div>
    </div>
  );
};
