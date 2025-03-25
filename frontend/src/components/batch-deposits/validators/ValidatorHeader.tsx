import type { FC } from "react";
import type { IValidatorHeader } from "pec/types/batch-deposits";
import { TertiaryButton } from "pec/components/ui/custom/TertiaryButton";
import { EIconPosition } from "pec/types/components";
import { X } from "lucide-react";

export const ValidatorHeader: FC<IValidatorHeader> = (props) => {
  const { selectedCount, totalCount, onClear } = props;

  return (
    <div className="flex flex-row justify-between">
      <div className="text-lg">Select Validators</div>
      <div className="flex flex-row items-center gap-4">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {selectedCount} / {totalCount} selected
        </div>

        <TertiaryButton
          className="border-indigo-200 text-indigo-800 dark:border-gray-600 dark:text-indigo-300"
          label="Clear"
          icon={<X />}
          iconPosition={EIconPosition.LEFT}
          onClick={onClear}
          disabled={false}
        />
      </div>
    </div>
  );
};
