import { Circle, CircleDot } from "lucide-react";
import type { IDistributionOptionProps } from "pec/types/batch-deposits";
import type { FC } from "react";

export const DistributionOption: FC<IDistributionOptionProps> = ({
  option,
  isSelected,
  onClick,
}) => {
  return (
    <div
      className={`flex w-full flex-row items-start gap-4 rounded-xl bg-white p-4 dark:bg-black ${
        isSelected
          ? "border border-indigo-500 dark:border-indigo-500"
          : "cursor-pointer"
      }`}
      onClick={onClick}
    >
      <div className="flex-shrink-0">
        {isSelected ? (
          <CircleDot className="h-4 w-4 fill-indigo-500 text-white" />
        ) : (
          <Circle className="h-4 w-4 text-indigo-500" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="text-sm font-medium">{option.title}</div>
        <div className="text-xs text-gray-700 dark:text-gray-300">
          {option.description}
        </div>
      </div>
    </div>
  );
};
