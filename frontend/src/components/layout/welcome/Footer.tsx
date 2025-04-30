"use client";

import { EnterAnimation } from "pec/app/(login-layout)/welcome/_components/enter-animation";
import { welcomeAnimationDelays } from "pec/constants/animationDelays";
import type { FC } from "react";
import { RenderLogo } from "../BottomBar";

export const Footer: FC = () => {
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
          <RenderLogo logo="PierTwo" width={150} height={150} />
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
          <RenderLogo logo="Labrys" width={150} height={150} />
          <div className="text-[11px] leading-[11px] text-zinc-600">
            Onchain developers
          </div>
        </EnterAnimation>
      </div>
    </div>
  );
};
