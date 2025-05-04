"use client";

import { GradientShield } from "./gradient-shield";
import { EnterAnimation } from "pec/app/(login-layout)/welcome/_components/enter-animation";
import { welcomeAnimationDelays } from "pec/constants/animationDelays";
import { ClingableElement } from "pec/components/ui/clingable-element";

const benefits = [
  {
    title: "Earn More Rewards",
    description:
      "Put idle ETH to work on your validator by not having to wait for another 32 ETH as well as harness the auto-compounding benefits of Pectra.",
  },
  {
    title: "Gain Control",
    description:
      "Submit partial withdrawals and full exists by triggering them via a web3 wallet with your validator withdrawal address.",
  },
  {
    title: "Scale Ethereum",
    description:
      "Instead of managing multiple 32 ETH validators, consolidate your validators  into a single validator, up to 2048 ETH, to reduce Ethereum network strain.",
  },
];

interface BenefitCardProps {
  title: string;
  description: string;
  index: number;
  delay: number;
}

const BenefitCard = ({
  title,
  description,
  index,
  delay,
}: BenefitCardProps) => {
  return (
    <ClingableElement className="flex flex-row items-stretch rounded-lg">
      <EnterAnimation
        className="flex w-full flex-col items-start gap-6 rounded-lg border-[0.5px] border-border bg-white p-6 sm:max-w-[330px] dark:border-gray-700 dark:bg-black"
        delay={delay}
      >
        <div className="flex size-8 items-center justify-center rounded bg-primary/15 text-[16px] font-[790] text-primary">
          {index + 1}
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-[18px] font-670 text-[#4C4C4C] dark:text-zinc-50">
            {title}
          </div>
          <p className="text-[14px] font-380 text-[#4C4C4C] dark:text-zinc-50">
            {description}
          </p>
        </div>
      </EnterAnimation>
    </ClingableElement>
  );
};

export const Information = () => {
  return (
    <div className="flex w-full flex-col items-center gap-6 text-black dark:text-white">
      <EnterAnimation
        delay={welcomeAnimationDelays.infoParagraph}
        className="flex w-full flex-col items-center justify-center gap-x-1 gap-y-2 text-center text-[14px] font-570 leading-[14px] text-[#27272A] dark:text-zinc-50"
      >
        <p>Use this tool to upgrade your existing Ethereum validators from</p>
        <p>0x01 to 0x02 credentials validators to be able to:</p>
      </EnterAnimation>

      <div className="flex w-full flex-col justify-center gap-3 sm:flex-row">
        {benefits.map((benefit, index) => {
          const delay = welcomeAnimationDelays.infoCards[index] ?? 0;
          return (
            <BenefitCard
              key={benefit.title}
              {...benefit}
              index={index}
              delay={delay}
            />
          );
        })}
      </div>

      <ClingableElement className="rounded-xl">
        <EnterAnimation
          delay={welcomeAnimationDelays.infoShield}
          className="flex w-full flex-col items-start gap-[10px] rounded-xl bg-black/[2%] px-6 py-3 text-[15px] font-380 sm:max-w-[683px] sm:flex-row sm:items-center"
        >
          <GradientShield className="size-8 flex-shrink-0 sm:size-8" />
          <p>
            You retain full control over your validators and staked ETH at all
            times. This tool does not control, custody, manage, or interact with
            your ETH or validator keys - you do.
          </p>
        </EnterAnimation>
      </ClingableElement>
    </div>
  );
};
