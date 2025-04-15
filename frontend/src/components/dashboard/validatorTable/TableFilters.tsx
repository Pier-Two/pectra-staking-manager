import clsx from "clsx";
import { CirclePlus, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "pec/components/ui/button";
import { Checkbox } from "pec/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "pec/components/ui/dropdown-menu";
import { Input } from "pec/components/ui/input";
import { Separator } from "pec/components/ui/separator";
import { ValidatorStatus } from "pec/types/validator";
import type { ITableFiltersProps } from "pec/types/validatorTable";
import type { FC } from "react";

export const TableFilters: FC<ITableFiltersProps> = (props) => {
  
  const { searchTerm, onSearchChange, statusFilter, onStatusFilterChange } =
    props;

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 items-center w-full">
      <div className="w-full flex-grow">
        <Input
          placeholder="Search validators..."
          className="rounded-full w-full border-indigo-200 bg-white text-gray-500 dark:border-gray-800 dark:bg-black dark:text-white"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-full md:w-auto shrink-0 bg-white dark:bg-black rounded-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center px-2 w-full rounded-full border-2 border-dashed border-indigo-200 dark:border-gray-800 hover:cursor-pointer max-w-[90vw]">
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
                    className={clsx(`p-2 text-[12px] rounded-md leading-[12px] text-[#4C4C4C] text-sm font-normal flex items-center justify-center ${
                      statusFilter.includes(status)
                        ? "bg-[#F1F3FF] text-indigo-500 dark:bg-gray-900 dark:text-white"
                        : "dark:text-gray-400 rounded-md"
                    }`)}
                    onClick={() => onStatusFilterChange(status)}
                  >
                    {status}
                  </div>
                ))}
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start" className="bg-white dark:bg-black w-[200px] max-w-[90vw]">
            <div className="w-full flex items-center px-2 bg-white dark:bg-black">
              <Search className="h-4 w-4 text-gray-400 dark:text-gray-400 rounded-full" />
              <Input
                placeholder="Search"
                className="border-none bg-white text-gray-500 pl-1 dark:text-white dark:bg-black placeholder:text-gray-400 dark:placeholder:text-gray-600"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <Separator />
            {Object.values(ValidatorStatus).map((status) => (
              <DropdownMenuItem key={status}>
                <Button
                  variant="default"
                  className={clsx(`cursor-pointer bg-white px-2 hover:bg-gray-50 font-normal justify-between items-center rounded-md w-full dark:bg-black ${
                    statusFilter.includes(status)
                      ? "text-indigo-500 dark:text-indigo-200 hover:bg-gray-50 dark:hover:bg-gray-900"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
                  }`)}
                  onClick={() => onStatusFilterChange(status)}
                >
                  <div className="flex items-center">
                  <Checkbox
                  className="mr-4 dark:border-gray-800 dark:bg-black"
                  checked={statusFilter.includes(status)}
                  onCheckedChange={() => onStatusFilterChange(status)}
                  />
                  {status}
                  </div>
                  <span className="text-sm font-normal">20</span>
                </Button>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Button
        className="flex rounded-full w-full md:w-auto px-4 border-indigo-200 dark:border-gray-800 shrink-0"
        variant="outline"
      >
        <SlidersHorizontal className="h-3 w-3 dark:text-white" />
        View
      </Button>
      
    </div>
  );
};
