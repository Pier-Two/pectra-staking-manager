import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

export type SortDirection = "asc" | "desc" | null;

export interface IValidatorHeaderProps {
  label: string;
  showSort: boolean;
  sortDirection: SortDirection;
  onSort: () => void;
}

export const ColumnHeader = (props: IValidatorHeaderProps) => {
  const { label, sortDirection, onSort, showSort } = props;

  return (
    <div
      className={`flex items-center gap-2 ${
        showSort ? "cursor-pointer" : "cursor-default"
      }`}
      onClick={showSort ? onSort : undefined}
    >
      <div className="text-sm text-gray-700 dark:text-gray-300">{label}</div>
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
