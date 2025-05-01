import { cn } from "pec/lib/utils";
import type { IDistributionOptionProps } from "pec/types/batch-deposits";
import type { FC } from "react";

export const DistributionOption: FC<IDistributionOptionProps> = ({
  option,
  isSelected,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-start gap-4 rounded-2xl border border-transparent bg-white px-4 py-3 transition-colors duration-200 hover:border-border dark:bg-black dark:hover:border-gray-800",
        {
          "!border-primary dark:!border-primary": isSelected,
          "cursor-pointer": !isSelected,
        },
      )}
      onClick={onClick}
    >
      <div className="flex w-full flex-row items-start gap-2">
        <div className="mt-1 flex-shrink-0">
          <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-transparent">
            <div
              className={`h-2.5 w-2.5 rounded-full ${isSelected ? "bg-primary" : "bg-transparent"}`}
            />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="text-base font-medium">{option.title}</div>
          <div className="text-sm text-piertwo-text">
            {option.description}
          </div>
        </div>
      </div>
    </div>
  );
};
