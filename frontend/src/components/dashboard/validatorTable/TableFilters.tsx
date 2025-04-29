import { CirclePlus, Search } from "lucide-react";
import { Checkbox } from "pec/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "pec/components/ui/dropdown-menu";
import { Input } from "pec/components/ui/input";
import { Separator } from "pec/components/ui/separator";
import { SearchFilter } from "pec/components/ui/table/SearchFilter";
import { cn } from "pec/lib/utils";
import { ValidatorStatus } from "pec/types/validator";
import type { FC } from "react";

export interface ITableFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string[];
  onStatusFilterChange: (status: string) => void;
  getValidatorCount: (status: ValidatorStatus) => number;
}

export const TableFilters: FC<ITableFiltersProps> = (props) => {
  const {
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
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

  return (
    <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
      <div className="w-full flex-grow">
        <SearchFilter searchTerm={searchTerm} setSearchTerm={onSearchChange} />
      </div>
      <div className="w-full shrink-0 rounded-full bg-white dark:bg-black md:w-auto">
        {/* Status Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
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
                    className={cn(
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
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="start"
            className="bg-white dark:bg-gray-900 w-[200px] max-w-[90vw] border-indigo-200 dark:border-gray-500 rounded-xl p-2"
          >
            {/* Dropdown Header */}
            <div className="w-full flex items-center px-2 bg-white dark:bg-gray-900">
              <Search className="h-4 w-4 text-gray-400 dark:text-gray-400 rounded-full" />
              <Input
                placeholder="Search"
                className="border-none bg-white text-gray-500 pl-1 dark:text-white dark:bg-black placeholder:text-gray-400 dark:placeholder:text-gray-600"
                value={searchTerm}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                }}
              />
            </div>
            <Separator className="bg-indigo-100 dark:bg-gray-800" />

            {/* Dropdown Items */}
            {statusItems.map((item) => (
              <DropdownMenuItem key={item.value} asChild>
                <div
                  className={cn(
                    "cursor-pointer bg-white px-2 font-normal justify-between items-center rounded-md w-full dark:bg-black my-2 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900",
                    {
                      "text-indigo-500 dark:text-indigo-200": item.isSelected,
                    }
                  )}
                  onClick={item.onClick}
                >
                  <div className="flex items-center">
                    <Checkbox
                      className="mr-4 dark:border-gray-800 dark:bg-black"
                      checked={item.isSelected}
                      onCheckedChange={item.onClick}
                    />
                    {item.label}
                  </div>
                  {item.count !== undefined && (
                    <span className="text-sm font-normal">{item.count}</span>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
