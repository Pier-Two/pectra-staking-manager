import { CircleCheck } from "lucide-react";
import type { FC } from "react";

export const Information: FC = () => {
  const benefits = [
    "Auto-compounding interest",
    "Instant onchain withdrawals",
    "Validator consolidation",
  ];

  return (
    <div className="flex w-full flex-col gap-y-3 text-black dark:text-white">
      <p className="font-570 w-full text-center text-[14px] leading-[14px] text-zinc-700">
        Use this tool to enable and manage:
      </p>

      <div className="flex w-full flex-wrap justify-center gap-3">
        {benefits.map((benefit) => (
          <div
            key={benefit}
            className="flex h-10 w-fit flex-row items-center gap-3 rounded-lg border-[0.5px] border-border bg-white p-3 dark:border-gray-700 dark:bg-black"
          >
            <CircleCheck className="h-4 w-4 fill-primary text-white" />
            <div className="font-570 pt-[2px] text-[14px] leading-[14px] text-[#4C4C4C]">
              {benefit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
