import { FC } from "react";
import { Button } from "pec/components/ui/button";
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

      <div className="flex flex-row justify-between gap-2">
        {benefits.map((benefit) => (
          <Button
            key={benefit}
            className="rounded-xl border-gray-700 bg-white dark:border-gray-200 dark:bg-black"
            variant="outline"
          >
            <CircleCheck fill="black" className="h-4 w-4 text-white" />
            {benefit}
          </Button>
        ))}
      </div>
    </div>
  );
};
