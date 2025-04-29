import type { FC } from "react";
import { GradientShield } from "./gradient-shield";
import {
  EnterAnimation,
  EnterAnimationParagraph,
} from "pec/app/(login-layout)/welcome/_components/enter-animation";
import { welcomeAnimationDelays } from "pec/constants/animationDelays";
const benefits = [
  {
    title: "Auto-compounding interest",
    description:
      "Automatically restakes your ETH rewards updating your validator's withdrawal credentials to Type 2 (0x02).",
  },
  {
    title: "Onchain withdrawals",
    description:
      "Submit partial withdrawals using only your withdrawal credential wallet, directly on the execution layer.",
  },
  {
    title: "Validator consolidation",
    description:
      "Merge multiple validators into fewer, larger ones with balances up to 2,048 ETH, via a simple click-through process.",
  },
];

export const Information: FC = () => {
  return (
    <div className="flex w-full flex-col items-center gap-6 text-black dark:text-white">
      <EnterAnimationParagraph
        delay={welcomeAnimationDelays.infoParagraph}
        className="w-full text-center text-[14px] font-570 leading-[14px] text-[#27272A] dark:text-zinc-50"
      >
        The Pectra Staking Manager is a self-service tool designed solely to
        help you:
      </EnterAnimationParagraph>

      <div className="flex w-full justify-center gap-3">
        {benefits.map((benefit, index) => (
          <EnterAnimation
            key={benefit.title}
            className="flex max-w-[330px] flex-col items-start gap-6 rounded-lg border-[0.5px] border-border bg-white p-6 dark:border-gray-700 dark:bg-black"
            delay={welcomeAnimationDelays.infoCards[index]}
          >
            <div className="flex size-8 items-center justify-center rounded bg-primary/15 text-[16px] font-[790] text-primary">
              {index + 1}
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-[18px] font-670 text-[#4C4C4C] dark:text-zinc-50">
                {benefit.title}
              </div>
              <p className="text-[14px] font-380 text-[#4C4C4C] dark:text-zinc-50">
                {benefit.description}
              </p>
            </div>
          </EnterAnimation>
        ))}
      </div>

      <EnterAnimation
        delay={welcomeAnimationDelays.infoShield}
        className="flex max-w-[683px] flex-row items-center gap-[10px] rounded-xl bg-black/[2%] px-6 py-3 text-[15px] font-380"
      >
        <GradientShield className="size-12" />
        <p>
          You retain full control over your validators and staked ETH at all
          times. This tool does not control, custody, manage, or interact with
          your ETH or validator keys - you do.
        </p>
      </EnterAnimation>
    </div>
  );
};
