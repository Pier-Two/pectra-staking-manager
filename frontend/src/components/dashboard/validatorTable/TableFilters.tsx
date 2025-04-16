import clsx from "clsx";
import { CirclePlus, SlidersHorizontal } from "lucide-react";
import { Button } from "pec/components/ui/button";
import { Input } from "pec/components/ui/input";
import { Separator } from "pec/components/ui/separator";
import { ValidatorStatus } from "pec/types/validator";
import type { ITableFiltersProps } from "pec/types/validatorTable";
import type { FC } from "react";
import { TableFilterDropdown } from "./TableFilterDropdown";
interface ViewItem {
  label: string;
  value: string;
  isSelected: boolean;
  onClick: () => void;
}

// Default Options That Can Be Filtered
const defaultFilteredOptions = [
  "Active since",
  "Status",
  "Balance",
];


export const TableFilters: FC<ITableFiltersProps> = (props) => {
  const { searchTerm, onSearchChange, statusFilter, onStatusFilterChange, filterTableOptions, onFilterTableOptionsChange } = props;

  // Create a array of items for the Status dropdown menu
  const statusItems = Object.values(ValidatorStatus).map((status) => ({
    label: status,
    value: status,
    count: 20,
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
    <div className="flex flex-col md:flex-row justify-between gap-4 items-center w-full">

      {/* Search Input */}
      <div className="w-full flex-grow">
        <Input
          placeholder="Search validators..."
          className="rounded-full w-full border-indigo-200 bg-white text-gray-500 dark:border-gray-800 dark:bg-black dark:text-white"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Status Filter Dropdown */}
      <div className="w-full md:w-auto shrink-0 bg-white dark:bg-black rounded-full">
        <TableFilterDropdown
          showSearch
          items={statusItems}
          trigger={
            <div className="flex items-center w-full rounded-full border-2 border-dashed border-indigo-200 dark:border-gray-800 hover:cursor-pointer max-w-[90vw]">
              <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-l-full h-10">
                <CirclePlus className="h-3 w-3 dark:text-white" />
                <span className="hidden md:inline">Status</span>
              </div>
              <div className="h-6">
                <Separator orientation="vertical" className="h-full w-[1px] bg-indigo-200 dark:bg-gray-800" />
              </div>
              <div className="flex items-center gap-2 px-2 justify-center cursor-default">
                {Object.values(ValidatorStatus).map((status) => (
                  <div
                    key={status}
                    className={clsx("p-2 text-[12px] rounded-md leading-[12px] text-[#4C4C4C] text-sm font-normal flex items-center justify-center",
                      {
                        "bg-[#F1F3FF] text-indigo-500 dark:bg-gray-900 dark:text-white": statusFilter.includes(status),
                        "dark:text-gray-400 rounded-md": !statusFilter.includes(status),
                      }
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
            className="flex rounded-full w-full md:w-auto px-4 bg-white dark:bg-black border-indigo-200 dark:border-gray-800 shrink-0 hover:bg-gray-50 dark:hover:bg-gray-900"
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
