import type { FC } from "react";
import {
  ESortDirection,
  type ITableHeadersRowProps,
} from "pec/types/validatorTable";
import { ChevronsLeftRight } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { DASHBOARD_VALIDATOR_COLUMN_HEADERS } from "pec/constants/columnHeaders";

export const TableHeader: FC<ITableHeadersRowProps> = ({
  sortConfig,
  onSort,
}) => {
  return (
    <div className="flex flex-row items-center justify-between gap-1 px-6">
      {DASHBOARD_VALIDATOR_COLUMN_HEADERS.map((header) => (
        <div
          className="flex-1 cursor-pointer"
          key={header.sortKey}
          onClick={() => onSort(header.sortKey)}
        >
          <div className="flex items-center gap-1 text-sm">
            {header.label}

            {sortConfig?.key === header.sortKey ? (
              sortConfig?.direction === ESortDirection.ASC ? (
                <ChevronUp className="h-3 w-3 dark:text-white" />
              ) : (
                <ChevronDown className="h-3 w-3 dark:text-white" />
              )
            ) : (
              <ChevronsLeftRight className="h-3 w-3 rotate-90 dark:text-white" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
