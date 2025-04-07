import type { FC } from "react";
import { ValidatorStatus } from "pec/types/validator";
import { Input } from "pec/components/ui/input";
import { Button } from "pec/components/ui/button";
import { CirclePlus } from "lucide-react";
import type { ITableFiltersProps } from "pec/types/validatorTable";

export const TableFilters: FC<ITableFiltersProps> = (props) => {
  const { searchTerm, onSearchChange, statusFilter, onStatusFilterChange } =
    props;

  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row">
      <div className="w-full">
        <Input
          placeholder="Search validators..."
          className="rounded-xl border-indigo-200 bg-white text-gray-500 dark:border-gray-800 dark:bg-black dark:text-white"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <div className="flex items-center gap-4 rounded-xl border-2 border-dashed border-gray-200 bg-white pe-4 ps-4 dark:border-gray-800 dark:bg-black">
          <CirclePlus className="h-3 w-3 dark:text-white" />
          <span>Status</span>
          <div className="flex gap-1">
            {Object.values(ValidatorStatus).map((status) => (
              <Button
                key={status}
                variant="default"
                className={`cursor-pointer font-normal dark:bg-black ${
                  statusFilter.includes(status)
                    ? "text-indigo-500 dark:text-indigo-200"
                    : ""
                }`}
                onClick={() => onStatusFilterChange(status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {/* <Button
          className="rounded-xl bg-white border-gray-200 dark:border-gray-800 dark:bg-black"
          variant="outline"
        >
          <SlidersHorizontal className="h-3 w-3 dark:text-white" />
          View
        </Button> */}
      </div>
    </div>
  );
};
