"use client";

import clsx from "clsx";
import {
  ArrowDownToDot,
  ArrowRight,
  ArrowUpFromDot,
  Merge,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { EIconPosition } from "pec/types/components";

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
  },
  BatchDeposit: {
    title: "Batch Deposit",
    description:
      "Deposit multiple active validators at once, via Pier Two's batch deposit contract.",
    url: "/batch-deposit",
    buttonLabel: "Deposit now",
    icon: <ArrowDownToDot size={24} />,
    iconHover: "group-hover:text-blue-200",
  },
  Withdrawal: {
    title: "Partial Withdrawal",
    description:
      "Submit onchain execution layer withdrawal requests against validators, as per Pectra EIP-7002.",
    url: "/withdraw",
    buttonLabel: "Withdraw now",
    icon: <ArrowUpFromDot size={24} />,
    iconHover: "group-hover:text-green-400",
  },
};

export const ToolCard = ({ preset }: ToolCardProps) => {
  const { title, description, url, buttonLabel, icon, iconHover } =
    cardPresets[preset];

  const router = useRouter();

  const handleRedirect = () => {
    router.push(url);
  };

  return (
    <div
      className="hover:bg-activeCard hover:border-3 group flex h-[231px] grow basis-0 flex-col space-y-4 rounded-2xl border border-indigo-200 bg-white p-6 text-gray-900 hover:cursor-pointer hover:text-white dark:border-gray-700 dark:bg-black dark:text-white"
      onClick={handleRedirect}
    >
      <div
        className={clsx(
          "flex flex-row items-center gap-x-2 text-primary-dark dark:text-indigo-200",
          iconHover,
        )}
      >
        {icon}
        <p className="text-[24px] font-670 leading-[24px]">{title}</p>
      </div>

      <div className="flex flex-grow flex-col justify-end gap-y-4">
        <p className="text-[16px] font-380 leading-[16px]">{description}</p>

        <PrimaryButton
          className="w-fit border-white text-[13px] font-570 leading-[13px] backdrop-blur-xl group-hover:border group-hover:bg-white/10 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-indigo-800"
          label={buttonLabel}
          // TODO: Implement animation for arrow
          icon={<ArrowRight />}
          iconPosition={EIconPosition.RIGHT}
          onClick={handleRedirect}
          disabled={false}
        />
      </div>
    </div>
  );
};
