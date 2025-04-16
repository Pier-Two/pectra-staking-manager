import clsx from "clsx";
import { ChevronDown, ChevronsLeftRight, ChevronUp } from "lucide-react";
import { DASHBOARD_VALIDATOR_COLUMN_HEADERS } from "pec/constants/columnHeaders";
import {
  ESortDirection,
  type ITableHeadersRowProps,
} from "pec/types/validatorTable";
import type { FC } from "react";

// This is the config for the grid template columns MIN and MAX widths then
export const getGridTemplateColumns = (filterLength: number) => {
  const templates = {
    0: "[grid-template-columns:minmax(150px,200px)_minmax(150px,200px)_minmax(100px,200px)_minmax(100px,200px)_minmax(100px,200px)_minmax(50px,100px)]",
    1: "[grid-template-columns:minmax(150px,200px)_minmax(150px,200px)_minmax(100px,200px)_minmax(100px,200px)_minmax(50px,100px)]",
    2: "[grid-template-columns:minmax(150px,200px)_minmax(150px,200px)_minmax(100px,200px)_minmax(50px,100px)]",
    3: "[grid-template-columns:minmax(150px,200px)_minmax(150px,200px)_minmax(50px,100px)]",
  };
  return templates[filterLength as keyof typeof templates];
}; 

export const TableHeader: FC<ITableHeadersRowProps> = ({
  sortConfig,
  onSort,
  filterTableOptions,
}) => {

  const tableHeaderItems = DASHBOARD_VALIDATOR_COLUMN_HEADERS.filter((header) => !filterTableOptions.includes(header.label));


  return (
    <div className={clsx("grid w-fit items-center gap-1",
      getGridTemplateColumns(filterTableOptions.length)
    )}>
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
