import type { FC } from "react";
import { CircleCheck } from "lucide-react";

export const Information: FC = () => {
  const benefits = [
    "Auto-compounding interest",
    "Instant onchain withdrawals",
    "Validator consolidation",
  ];

  return (
    <div className="mt-12 flex w-full flex-col gap-2 text-black dark:text-white">
      <div className="w-full text-center text-xs">
        Use this tool to enable and manage:
      </div>

      <div className="flex w-full flex-col gap-3 md:flex-row md:flex-wrap md:justify-center">
        {benefits.map((benefit) => (
          <div
            key={benefit}
            className="flex w-full flex-row items-center gap-2 rounded-xl border border-gray-300 bg-white p-2 dark:border-gray-700 dark:bg-black md:w-[200px]"
          >
            <CircleCheck className="h-4 w-4 fill-indigo-500 text-white" />
            <div className="text-xs">{benefit}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
