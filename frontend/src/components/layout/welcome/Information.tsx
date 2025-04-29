import type { FC } from "react";
import { EnterAnimation } from "pec/app/(login-layout)/welcome/_components/enter-animation";

const benefits = [
  {
    title: "Auto-compounding interest",
    description:
      "Automatically restakes your ETH rewards updating your validator’s withdrawal credentials to Type 2 (0x02).",
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
    <div className="flex w-full flex-col gap-6 text-black dark:text-white">
      <p className="w-full text-center text-[14px] font-570 leading-[14px] text-[#27272A] dark:text-zinc-50">
        The Pectra Staking Manager is a self-service tool designed solely to
        help you:
      </p>

      <div className="flex w-full justify-center gap-3">
        {benefits.map((benefit, index) => (
          <EnterAnimation key={benefit.title} delay={0.6 + index * 0.2}>
            <div className="flex max-w-[330px] flex-col items-start gap-6 rounded-lg border-[0.5px] border-border bg-white p-6 dark:border-gray-700 dark:bg-black">
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
            </div>
          </EnterAnimation>
        ))}
      </div>
    </div>
  );
};
