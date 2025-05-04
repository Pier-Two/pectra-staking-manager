"use client";

import { EnterAnimation } from "pec/app/(login-layout)/welcome/_components/enter-animation";
import { welcomeAnimationDelays } from "pec/constants/animationDelays";
import type { FC } from "react";
import { RenderLogo } from "../BottomBar";
import Link from "next/link";
import { labrysUrl, pierTwoUrl } from "pec/helpers/getExternalLink";
import { ClingableElement } from "pec/components/ui/clingable-element";

export const Footer: FC = () => {
  return (
    <div className="mt-9 flex flex-col items-center font-inter text-xs font-light">
      <div className="flex flex-row gap-16 text-gray-500 dark:text-gray-400">
        <ClingableElement className="rounded-xl p-2">
          <EnterAnimation
            delay={welcomeAnimationDelays.footer.pierTwo}
            className="flex flex-col items-center gap-y-3"
          >
            <Link
              target="_blank"
              href={pierTwoUrl}
              className="flex flex-col items-center gap-y-3 hover:cursor-pointer"
            >
              <div className="text-[11px] leading-[11px] text-zinc-600">
                Product by
              </div>
              <RenderLogo logo="PierTwo" width={150} height={150} />
              <div className="text-[11px] leading-[11px] text-zinc-600">
                Onchain infrastructure
              </div>
            </Link>
          </EnterAnimation>
        </ClingableElement>

        <ClingableElement className="rounded-xl p-2">
          <EnterAnimation
            delay={welcomeAnimationDelays.footer.labrys}
            className="flex flex-col items-center gap-y-3"
          >
            <Link
              target="_blank"
              href={labrysUrl}
              className="flex flex-col items-center gap-y-3 hover:cursor-pointer"
            >
              <div className="text-[11px] leading-[11px] text-zinc-600">
                Produced by
              </div>
              <RenderLogo logo="Labrys" width={150} height={150} />
              <div className="text-[11px] leading-[11px] text-zinc-600">
                Onchain developers
              </div>
            </Link>
          </EnterAnimation>
        </ClingableElement>
      </div>
    </div>
  );
};
