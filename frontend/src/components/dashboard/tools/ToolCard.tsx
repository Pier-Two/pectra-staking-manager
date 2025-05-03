import {
  ArrowDownToDot,
  ArrowRight,
  ArrowUpFromDot,
  Merge,
} from "lucide-react";
import { cn } from "pec/lib/utils";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { EIconPosition } from "pec/types/components";
import Link from "next/link";
import { EnterAnimation } from "pec/app/(login-layout)/welcome/_components/enter-animation";
import { dashboardAnimationDelays } from "pec/constants/animationDelays";
type ToolCardProps = {
  preset: keyof typeof cardPresets;
};

export const cardPresets = {
  Consolidate: {
    title: "Consolidate",
    description:
      "Combine multiple Pectra validators (0x02 credentials) into one large-balance validator.",
    url: "/consolidate",
    buttonLabel: "Consolidate now",
    icon: <Merge className="rotate-90" size={24} />,
    iconHover: "group-hover:text-orange-400",
    delay: dashboardAnimationDelays.toolCards.consolidate,
  },
  BatchDeposit: {
    title: "Deposit",
    description:
      "Deposit any increment of ETH to your existing validators to manage their balance.",
    url: "/deposit",
    buttonLabel: "Deposit now",
    icon: <ArrowDownToDot size={24} />,
    iconHover: "group-hover:text-blue-200",
    delay: dashboardAnimationDelays.toolCards.batchDeposit,
  },
  Withdrawal: {
    title: "Unstake",
    description:
      "Trigger onchain partial withdrawals and full exits with a transaction.",
    url: "/unstake",
    buttonLabel: "Unstake now",
    icon: <ArrowUpFromDot size={24} />,
    iconHover: "group-hover:text-green-400",
    delay: dashboardAnimationDelays.toolCards.withdrawal,
  },
};

export const ToolCard = ({ preset }: ToolCardProps) => {
  const { title, description, url, buttonLabel, icon, iconHover, delay } =
    cardPresets[preset];

  return (
    <EnterAnimation delay={delay}>
      <Link href={url}>
        <div className="hover:bg-activeCard hover:border-3 group flex h-[231px] grow basis-0 flex-col space-y-4 rounded-2xl border border-indigo-200 bg-white p-6 text-gray-900 hover:cursor-pointer hover:text-white dark:border-gray-700 dark:bg-black dark:text-white">
          <div
            className={cn(
              "flex flex-row items-center gap-x-2 text-primary-dark dark:text-indigo-200",
              iconHover,
            )}
          >
            {icon}
            <p className="text-2xl font-670 leading-[24px]">{title}</p>
          </div>

          <div className="flex flex-grow flex-col justify-end gap-y-6">
            <p className="h-12 text-base font-380 leading-[20px]">
              {description}
            </p>

            <PrimaryButton
              className="w-fit border-white text-xs font-570 leading-[13px] backdrop-blur-xl group-hover:border group-hover:bg-white/10 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-indigo-800"
              label={buttonLabel}
              icon={
                <ArrowRight className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5" />
              }
              iconPosition={EIconPosition.RIGHT}
              disabled={false}
            />
          </div>
        </div>
      </Link>
    </EnterAnimation>
  );
};
