import { ChevronDown, ChevronsLeftRight, ChevronUp } from "lucide-react";
import { cn } from "pec/lib/utils";
import { ValidatorDetails } from "pec/types/validator";
import {
  ESortDirection,
  IHeaderConfig,
  SortConfig,
} from "pec/types/validatorTable";

export interface ITableHeadersRowProps<T = ValidatorDetails> {
  sortConfig: SortConfig<T> | null;
  onSort: (key: keyof T) => void;
  headers: IHeaderConfig<T>[];
  disableSort?: boolean;
}

export const TableHeader = <T = ValidatorDetails,>({
  sortConfig,
  onSort,
  headers,
  disableSort,
}: ITableHeadersRowProps<T>) => {
  const renderSortIcon = (headerKey: keyof T) => {
    if (disableSort) return null;

    if (sortConfig?.key === headerKey) {
      return sortConfig.direction === ESortDirection.ASC ? (
        <ChevronUp className="h-3 w-3 dark:text-white" />
      ) : (
        <ChevronDown className="h-3 w-3 dark:text-white" />
      );
    }
    return <ChevronsLeftRight className="h-3 w-3 rotate-90 dark:text-white" />;
  };

  return (
    <>
      {/* Desktop View */}
      <thead className="hidden md:table-header-group">
        <tr className="table-row">
          {headers.map((header) => (
            <th
              key={header.sortKey as string}
              className={cn(
                "px-4 py-2 text-left font-inter text-sm font-medium text-gray-600 dark:text-gray-200",
                { "cursor-pointer": !disableSort },
              )}
              onClick={() => onSort(header.sortKey)}
            >
              <div className="flex items-center gap-1">
                {header.label}
                {renderSortIcon(header.sortKey)}
              </div>
            </th>
          ))}
        </tr>
      </thead>

      {/* Mobile View */}
      <thead className="md:hidden">
        <tr>
          {headers.map((header) => {
            if (!header.mobile) return null;

            return (
              <th
                key={header.sortKey as string}
                className={cn(
                  "px-4 py-2 text-left font-inter text-sm font-medium text-gray-600",
                  { "cursor-pointer": !disableSort },
                )}
                onClick={() => onSort(header.sortKey)}
              >
                <div className="flex items-center gap-1">
                  {header.label}
                  {renderSortIcon(header.sortKey)}
                </div>
              </th>
            );
          })}
        </tr>
      </thead>
    </>
  );
};
