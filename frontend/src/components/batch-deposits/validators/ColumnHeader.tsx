import type { FC } from "react";
import type { IValidatorHeaderProps } from "pec/types/batch-deposits";
import { ChevronsUpDown } from "lucide-react";

export const ColumnHeader: FC<IValidatorHeaderProps> = (props) => {
  const { label, showSort = false } = props;
  return (
    <div className="flex items-center gap-2">
      <div className="text-md text-gray-700 dark:text-gray-300">{label}</div>
      {showSort && (
        <ChevronsUpDown className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      )}
    </div>
  );
};
