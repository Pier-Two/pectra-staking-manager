import type { FC } from "react";

import {
  CONSOLIDATION_STEPS,
  ConsolidationStep,
} from "pec/types/consolidation";

import { SecondaryButton } from "../ui/custom/SecondaryButton";

export interface IProgressBar {
  progress: ConsolidationStep;
  backHandler: () => void;
}

export const ProgressBar: FC<IProgressBar> = (props) => {
  const { progress, backHandler } = props;

  const activeStyle = "bg-black dark:bg-white";
  const inactiveStyle = "bg-gray-200 dark:bg-gray-800";

  return (
    <div className="flex w-full items-center gap-2 pb-3">
      <SecondaryButton
        label="<"
        onClick={backHandler}
        disabled={CONSOLIDATION_STEPS[progress] === 1 || progress === "submit"}
      />

      {[1, 2, 3, 4].map((step) => (
        <div
          key={step}
          className={`h-1 flex-1 rounded-full ${CONSOLIDATION_STEPS[progress] >= step ? activeStyle : inactiveStyle}`}
        />
      ))}
    </div>
  );
};
