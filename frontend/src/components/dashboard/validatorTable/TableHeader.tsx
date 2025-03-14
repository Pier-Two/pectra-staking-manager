import type { FC } from "react";
import {
  ESortDirection,
  type ITableHeaderProps,
} from "pec/types/validatorTable";
import { TableHead } from "pec/components/ui/table";
import { ChevronUp, ChevronDown, ChevronsLeftRight } from "lucide-react";

export const TableHeader: FC<ITableHeaderProps> = (props) => {
  const { label, sortKey, sortConfig, onSort } = props;

  return (
    <TableHead onClick={() => onSort(sortKey)} className="cursor-pointer">
      <div className="flex items-center gap-1">
        {label}

        {sortConfig?.key === sortKey ? (
          sortConfig?.direction === ESortDirection.ASC ? (
            <ChevronUp className="h-3 w-3 dark:text-white" />
          ) : (
            <ChevronDown className="h-3 w-3 dark:text-white" />
          )
        ) : (
          <ChevronsLeftRight className="h-3 w-3 rotate-90 dark:text-white" />
        )}
      </div>
    </TableHead>
  );
};
