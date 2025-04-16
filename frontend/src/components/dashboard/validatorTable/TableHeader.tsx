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

  // Get all the headers that should be displayed in the table
  const tableHeaderItems = DASHBOARD_VALIDATOR_COLUMN_HEADERS.filter(
    (header) => !filterTableOptions.includes(header.label)
  );

  // Get Validator and Credentials headers for mobile view
  const validatorHeader = tableHeaderItems[0];
  const credentialsHeader = tableHeaderItems[2];

  return (
    <div className="w-full px-4">
      {/* Desktop View */}
      <div className="hidden md:grid md:grid-cols-6 md:gap-4 text-sm">
        {tableHeaderItems.map((header) => (
          <div
            key={header.sortKey}
            className="cursor-pointer"
            onClick={() => onSort(header.sortKey)}
          >
            <div className="flex items-center gap-1">
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
        <div />
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="grid grid-cols-3 gap-12 text-sm">
          {validatorHeader && (
            <div 
              className="cursor-pointer"
              onClick={() => onSort(validatorHeader.sortKey)}
            >
              <div className="flex items-center gap-1">
                {validatorHeader.label}
                {sortConfig?.key === validatorHeader.sortKey ? (
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
          )}

          {credentialsHeader && (
            <div 
              className="cursor-pointer"
              onClick={() => onSort(credentialsHeader.sortKey)}
            >
              <div className="flex items-center gap-1">
                {credentialsHeader.label}
                {sortConfig?.key === credentialsHeader.sortKey ? (
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
          )}

          <div className="flex justify-end"></div>
        </div>
      </div>
    </div>
  );
};
