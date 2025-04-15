import { CirclePlus, SlidersHorizontal } from "lucide-react";
import { Button } from "pec/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "pec/components/ui/dropdown-menu";
import { Input } from "pec/components/ui/input";
import { Separator } from "pec/components/ui/separator";
import { ValidatorStatus } from "pec/types/validator";
import type { ITableFiltersProps } from "pec/types/validatorTable";
import type { FC } from "react";

export const TableFilters: FC<ITableFiltersProps> = (props) => {
  
  const { searchTerm, onSearchChange, statusFilter, onStatusFilterChange } =
    props;

    console.log(statusFilter)

  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row items-center">
      <div className="w-full">
        <Input
          placeholder="Search validators..."
          className="rounded-full border-indigo-200 bg-white text-gray-500 dark:border-gray-800 dark:bg-black dark:text-white"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex gap-2 flex-row-reverse">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center gap-4 rounded-full border-2 border-dashed pr-4 dark:border-gray-800 border-indigo-200">
              <Button className="hidden md:flex gap-4 hover:bg-gray-50 bg-gray-50 rounded-l-full pe-4 ps-4 border-gray-700 dark:bg-gray-950 dark:hover:bg-gray-900">
                <CirclePlus className="h-3 w-3 dark:text-white" />
                <span>Status</span>
                
              </Button>
              <div className="flex gap-6">
              <Separator orientation="vertical" className="h-[90%] dark:text-white text-indigo-200"/>
                {Object.values(ValidatorStatus).map((status) => (
                  <div
                    key={status}
                    className={`cursor-pointer font-normal rounded-full dark:bg-black ${
                      statusFilter.includes(status)
                        ? "text-indigo-500 dark:text-indigo-200"
                        : ""
                    }`}
                    onClick={() => onStatusFilterChange(status)}
                  >
                    {status}
                  </div>
                ))}
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.values(ValidatorStatus).map((status) => (
              <DropdownMenuItem key={status}>
                <Button
                  variant="default"
                  className={`cursor-pointer font-normal rounded-full dark:bg-black ${
                    statusFilter.includes(status)
                      ? "text-indigo-500 dark:text-indigo-200"
                      : ""
                  }`}
                  onClick={() => onStatusFilterChange(status)}
                >
                  {status}
                </Button>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          className="flex md:hidden rounded-full w-full bg-white border-gray-200 dark:border-gray-800 dark:bg-black"
          variant="outline"
        >
          <SlidersHorizontal className="h-3 w-3 dark:text-white" />
          View
        </Button>
      </div>
    </div>
  );
};
