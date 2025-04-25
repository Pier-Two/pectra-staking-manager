import { clsx } from "clsx";
import { ChevronDown, ChevronsLeftRight, ChevronUp } from "lucide-react";
import { DASHBOARD_VALIDATOR_COLUMN_HEADERS } from "pec/constants/columnHeaders";
import { ValidatorDetails } from "pec/types/validator";
import {
  ESortDirection,
  IHeaderConfig,
  SortConfig,
} from "pec/types/validatorTable";
import type { FC } from "react";

// This is the config for the grid template columns MIN and MAX widths then flexbox handles the rest
export const getGridTemplateColumns = (filterLength: number) => {
  const templates = {
    0: "[grid-template-columns:minmax(150px,200px)_minmax(150px,200px)_minmax(100px,200px)_minmax(100px,200px)_minmax(75px,200px)_minmax(0px,100px)]",
    1: "[grid-template-columns:minmax(150px,200px)_minmax(150px,200px)_minmax(100px,200px)_minmax(75px,200px)_minmax(0px,100px)]",
    2: "[grid-template-columns:minmax(150px,200px)_minmax(150px,200px)_minmax(75px,200px)_minmax(0px,100px)]",
    3: "[grid-template-columns:minmax(150px,200px)_minmax(75px,200px)_minmax(0px,100px)]",
  };
  return templates[filterLength as keyof typeof templates];
};

export interface ITableHeadersRowProps {
  sortConfig: SortConfig<ValidatorDetails> | null;
  onSort: (key: keyof ValidatorDetails) => void;
  filterTableOptions: IHeaderConfig["label"][];
}

export const TableHeader: FC<ITableHeadersRowProps> = ({
  sortConfig,
  onSort,
  filterTableOptions,
}) => {
  // Get all the headers that should be displayed in the table
  const tableHeaderItems = DASHBOARD_VALIDATOR_COLUMN_HEADERS.filter(
    (header) => !filterTableOptions.includes(header.label),
  );

  // Get Validator and Credentials headers for mobile view
  const validatorHeader: IHeaderConfig = {
    label: "Validator",
    sortKey: "validatorIndex",
  };
  const credentialsHeader: IHeaderConfig = {
    label: "Credentials",
    sortKey: "withdrawalAddress",
  };

  return (
    <div className="flex w-full items-center justify-center">
      {/* Desktop View */}
      <div
        className={clsx(
          "hidden w-full pl-4 text-sm md:grid md:gap-4",
          getGridTemplateColumns(filterTableOptions.length),
        )}
      >
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
        <div className="grid grid-cols-3 gap-12 p-4 text-sm">
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
