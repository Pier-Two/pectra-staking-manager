import { ChevronDown, ChevronsLeftRight, ChevronUp } from "lucide-react";
import { DASHBOARD_VALIDATOR_COLUMN_HEADERS } from "pec/constants/columnHeaders";
import {
  ESortDirection,
  type ITableHeadersRowProps,
} from "pec/types/validatorTable";
import type { FC } from "react";

export const TableHeader: FC<ITableHeadersRowProps> = ({
  sortConfig,
  onSort,
  filterTableOptions,
}) => {

  const tableHeaderItems = DASHBOARD_VALIDATOR_COLUMN_HEADERS.filter((header) => !filterTableOptions.includes(header.label));


  return (
    <div className="hidden md:grid grid-cols-6 items-center gap-1 px-6">
      {tableHeaderItems.map((header) => (
        <div
          className="col-span-1 cursor-pointer"
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
      {/* Empty div for actions column */}
      <div className="col-span-1" />
    </div>
  );
};
