import type { FC } from "react";
import type { IDistributionOptionProps } from "pec/types/batch-deposits";
import { Circle, CircleDot } from "lucide-react";

export const DistributionOption: FC<IDistributionOptionProps> = (props) => {
  const { option, isSelected, onClick } = props;

  return (
    <div
      className={`flex w-full flex-row gap-4 rounded-xl bg-white p-4 dark:bg-black ${
        isSelected
          ? "border border-indigo-500 dark:border-indigo-500"
          : "cursor-pointer"
      }`}
      onClick={onClick}
    >
      {isSelected ? (
        <CircleDot className="h-10 w-10 fill-indigo-500 text-white" />
      ) : (
        <Circle className="h-10 w-10 text-indigo-500" />
      )}
      <div className="flex flex-col gap-2 p-1">
        <div className="text-md font-medium">{option.title}</div>
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {option.description}
        </div>
      </div>
    </div>
  );
};
