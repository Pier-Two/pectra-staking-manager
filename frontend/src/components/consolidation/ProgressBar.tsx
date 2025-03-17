import type { FC } from "react";
import type { IProgressBar } from "pec/types/consolidation";

export const ProgressBar: FC<IProgressBar> = (props) => {
  const { progress } = props;
  const activeStyle = "bg-black dark:bg-white";
  const inactiveStyle = "bg-gray-200 dark:bg-gray-800";

  return (
    <div className="flex w-full gap-2">
      {[1, 2, 3, 4].map((step) => (
        <div
          key={step}
          className={`h-2 flex-1 rounded-full ${progress === step ? activeStyle : inactiveStyle}`}
        />
      ))}
    </div>
  );
};
