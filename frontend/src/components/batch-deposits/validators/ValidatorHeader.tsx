import { X } from "lucide-react";
import { TertiaryButton } from "pec/components/ui/custom/TertiaryButton";
import { EIconPosition } from "pec/types/components";

export interface IValidatorHeader {
  selectedCount: number;
  totalCount: number;
  onClear: () => void;
}

export const ValidatorHeader = ({
  selectedCount,
  totalCount,
  onClear,
}: IValidatorHeader) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="text-lg font-670">Select validators</div>
      {selectedCount > 0 && (
        <div className="flex flex-row items-center gap-4">
          <div className="text-sm font-570">
            Selected {selectedCount} / {totalCount}
          </div>

          <TertiaryButton
            className="border-indigo-300 dark:border-primary-dark"
            label="Clear"
            icon={<X className="text-black dark:text-white" />}
            iconPosition={EIconPosition.LEFT}
            onClick={onClear}
            disabled={false}
          />
        </div>
      )}
    </div>
  );
};

