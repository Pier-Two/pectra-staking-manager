import { HiCheck } from "react-icons/hi";
import type { FC } from "react";

export const Information: FC = () => {
  const benefits = [
    "Auto-compounding interest",
    "Instant onchain withdrawals",
    "Validator consolidation",
  ];

  return (
    <div className="flex w-full flex-col gap-y-3 text-black dark:text-white">
      <p className="w-full text-center text-[14px] font-570 leading-[14px] text-[#27272A] dark:text-zinc-50">
        Use this tool to enable and manage:
      </p>

      <div className="flex w-full flex-wrap justify-center gap-3">
        {benefits.map((benefit) => (
          <div
            key={benefit}
            className="flex h-10 w-fit flex-row items-center gap-3 rounded-lg border-[0.5px] border-border bg-white p-3 dark:border-gray-700 dark:bg-black"
          >
            <div className="flex h-[13px] w-[13px] items-center justify-center rounded-full bg-primary">
              <HiCheck className="h-2 w-2 text-white dark:text-black" />
            </div>
            <div className="text-[14px] font-570 leading-[14px] text-[#4C4C4C] dark:text-zinc-50">
              {benefit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
