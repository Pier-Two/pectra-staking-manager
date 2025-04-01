import type { FC } from "react";
import { CircleCheck } from "lucide-react";

export const Information: FC = () => {
  const benefits = [
    "Auto-compounding interest",
    "Instant onchain withdrawals",
    "Validator consolidation",
  ];

  return (
    <div className="flex flex-col gap-4 text-black dark:text-white">
      <div className="text-center">Use this tool to enable and manage:</div>

      <div className="flex flex-row justify-between gap-3">
        {benefits.map((benefit) => (
          <div
            key={benefit}
            className="flex flex-row items-center gap-2 border p-2 rounded-xl border-gray-300 bg-white dark:border-gray-700 dark:bg-black"
          >
            <CircleCheck className="h-4 w-4 text-white fill-indigo-500" />
            {benefit}
          </div>
        ))}
      </div>
    </div>
  );
};
