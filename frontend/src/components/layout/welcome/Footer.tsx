"use client";

import { EnterAnimation } from "pec/app/_components/enter-animation";
import { welcomeAnimationDelays } from "pec/constants/animationDelays";
import type { FC } from "react";
import { RenderLogo } from "../BottomBar";
import Link from "next/link";
import {
  espUrl,
  ethFoundationUrl,
  labrysUrl,
  pierTwoUrl,
} from "pec/helpers/getExternalLink";
import { ClingableElement } from "pec/components/ui/clingable-element";
import { LogoType } from "pec/constants/logo";

export const Footer: FC = () => {
  return (
    <div className="mt-9 flex flex-col items-center font-inter text-xs font-light">
      <div className="flex flex-row flex-wrap items-center justify-center gap-16 text-gray-500 dark:text-gray-400">
        <FooterItem
          logo="PierTwo"
          aboveText="Product by"
          belowText="Onchain infrastructure"
          redirectUrl={pierTwoUrl}
          delay={welcomeAnimationDelays.footer.pierTwo}
        />
        <FooterItem
          logo="Labrys"
          aboveText="Product by"
          belowText="Onchain developers"
          redirectUrl={labrysUrl}
          delay={welcomeAnimationDelays.footer.labrys}
        />
        <FooterItem
          logo="ESP"
          aboveText="Sponored by"
          redirectUrl={espUrl}
          delay={welcomeAnimationDelays.footer.esp}
        />
        <FooterItem
          logo="ETHFoundation"
          aboveText="Sponored by"
          redirectUrl={ethFoundationUrl}
          delay={welcomeAnimationDelays.footer.ethFoundation}
        />
      </div>
    </div>
  );
};

interface FooterItemProps {
  delay: number;
  logo: LogoType;
  aboveText: string;
  belowText?: string;
  redirectUrl: string;
}

const FooterItem = ({
  logo,
  aboveText,
  belowText,
  redirectUrl,
  delay,
}: FooterItemProps) => {
  return (
    <ClingableElement className="rounded-full p-2">
      <EnterAnimation
        delay={delay}
        className="flex flex-col items-center gap-y-3"
      >
        <Link
          target="_blank"
          href={redirectUrl}
          className="flex flex-col items-center gap-y-3 hover:cursor-pointer"
        >
          <div className="text-[11px] leading-[11px] text-zinc-600">
            {aboveText}
          </div>
          <RenderLogo logo={logo} width={150} height={150} />
          {belowText && (
            <div className="text-[11px] leading-[11px] text-zinc-600">
              {belowText}
            </div>
          )}
        </Link>
      </EnterAnimation>
    </ClingableElement>
  );
};
