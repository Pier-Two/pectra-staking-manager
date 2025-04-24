import { X } from "lucide-react";
import { Button } from "pec/components/ui/button";

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
    <div className="relative flex flex-row justify-between">
      <div className="text-md font-medium">Select Validators</div>
      {selectedCount > 0 && (
        <div className="flex flex-row items-center gap-12 absolute right-0">
          <div className="font-inter text-md font-570">
            {selectedCount} / {totalCount} selected
          </div>

          {selectedCount > 0 && (
            <Button
              variant="ghost"
              className="border-indigo-200 dark:border-gray-800 border rounded-full"
              onClick={onClear}
              disabled={false}
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
          )}
        </div>
      )}
    </div>
  );
};
