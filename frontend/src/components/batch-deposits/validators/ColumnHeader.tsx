import type { FC } from "react";
import type { IValidatorHeaderProps } from "pec/types/batch-deposits";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

export type SortDirection = "asc" | "desc" | null;

export const ColumnHeader: FC<IValidatorHeaderProps> = (props) => {
  const { label, sortDirection, onSort, showSort } = props;

  return (
    <div
      className={`flex items-center gap-2 ${
        showSort ? "cursor-pointer" : "cursor-default"
      }`}
      onClick={showSort ? onSort : undefined}
    >
      <div className="text-md text-gray-700 dark:text-gray-300">{label}</div>
      {showSort && sortDirection === "asc" && (
        <ChevronUp className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      )}

      {showSort && sortDirection === "desc" && (
        <ChevronDown className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      )}

      {showSort && sortDirection === null && (
        <ChevronsUpDown className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      )}
    </div>
  );
};
