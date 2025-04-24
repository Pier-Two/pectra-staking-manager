import clsx from "clsx";
import { CirclePlus, SlidersHorizontal } from "lucide-react";
import { Button } from "pec/components/ui/button";
import { Input } from "pec/components/ui/input";
import { Separator } from "pec/components/ui/separator";
import { ValidatorStatus } from "pec/types/validator";
import type { IHeaderConfig } from "pec/types/validatorTable";
import type { FC } from "react";
import { TableFilterDropdown } from "./TableFilterDropdown";
interface ViewItem {
  label: string;
  value: string;
  isSelected: boolean;
  onClick: () => void;
}

export interface ITableFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string[];
  onStatusFilterChange: (status: string) => void;
  filterTableOptions: IHeaderConfig["label"][];
  onFilterTableOptionsChange: (option: IHeaderConfig["label"]) => void;
  getValidatorCount: (status: ValidatorStatus) => number;
}

// Default Options That Can Be Filtered in the view dropdown
const defaultFilteredOptions = ["Active since", "Status", "Balance"];

export const TableFilters: FC<ITableFiltersProps> = (props) => {
  const {
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    filterTableOptions,
    onFilterTableOptionsChange,
    getValidatorCount,
  } = props;

  // Create a array of items for the Status dropdown menu
  const statusItems = Object.values(ValidatorStatus).map((status) => ({
    label: status,
    value: status,
    count: getValidatorCount(status),
    isSelected: statusFilter.includes(status),
    onClick: () => onStatusFilterChange(status),
  }));

  // Create a array of items for the View dropdown menu
  const viewItems: ViewItem[] = defaultFilteredOptions.map((option) => ({
    label: option,
    value: option,
    isSelected: !filterTableOptions.includes(option),
    onClick: () => onFilterTableOptionsChange(option),
  }));

  return (
    <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
      {/* Search Input */}
      <div className="w-full flex-grow">
        <Input
          placeholder="Search validators..."
          className="w-full rounded-full border-indigo-200 bg-white text-gray-500 dark:border-gray-800 dark:bg-black dark:text-white"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Status Filter Dropdown */}
      <div className="w-full shrink-0 rounded-full bg-white dark:bg-black md:w-auto">
        <TableFilterDropdown
          showSearch
          items={statusItems}
          trigger={
            <div className="flex w-full items-center rounded-full border-2 border-dashed border-indigo-200 hover:cursor-pointer dark:border-gray-800">
              <div className="flex h-10 items-center gap-2 rounded-l-full px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-900">
                <CirclePlus className="h-3 w-3 dark:text-white" />
                <span className="hidden md:inline">Status</span>
              </div>
              <div className="h-6">
                <Separator
                  orientation="vertical"
                  className="h-full w-[1px] bg-indigo-200 dark:bg-gray-800"
                />
              </div>
              <div className="flex cursor-default items-center justify-center gap-2 px-2">
                {Object.values(ValidatorStatus).map((status) => (
                  <div
                    key={status}
                    className={clsx(
                      "flex items-center justify-center rounded-md p-2 text-[12px] text-sm font-normal leading-[12px] text-[#4C4C4C]",
                      {
                        "bg-[#F1F3FF] text-indigo-500 dark:bg-gray-900 dark:text-white":
                          statusFilter.includes(status),
                        "rounded-md dark:text-gray-400":
                          !statusFilter.includes(status),
                      },
                    )}
                    onClick={() => onStatusFilterChange(status)}
                  >
                    {status}
                  </div>
                ))}
              </div>
            </div>
          }
        />
      </div>

      {/* View Filter Dropdown */}
      <TableFilterDropdown
        items={viewItems}
        trigger={
          <Button
            className="flex w-full shrink-0 rounded-full border-indigo-200 bg-white px-4 hover:bg-gray-50 dark:border-gray-800 dark:bg-black dark:hover:bg-gray-900 md:w-auto"
            variant="outline"
          >
            <SlidersHorizontal className="h-3 w-3 dark:text-white" />
            View
          </Button>
        }
      />
    </div>
  );
};
