import { ColumnHeader } from "./ColumnHeader";
import type { SortDirection } from "pec/components/batch-deposits/validators/ColumnHeader";

interface IColumnHeader {
  label: string;
  showSort: boolean;
}

export interface IValidatorListHeaders {
  columnHeaders: readonly IColumnHeader[];
  sortColumn: string | null;
  sortDirection: SortDirection;
  onSort: (column: string) => void;
}

export const ValidatorListHeaders = ({
  columnHeaders,
  onSort,
  sortColumn,
  sortDirection,
}: IValidatorListHeaders) => {
  return (
    <div className="flex w-full items-center px-4">
      {columnHeaders.map((columnHeader, index) => (
        <div
          key={columnHeader.label}
          className={`flex-1 ${index === 0 ? "flex-[1.2]" : ""}`}
        >
          <ColumnHeader
            key={columnHeader.label}
            label={columnHeader.label}
            showSort={columnHeader.showSort}
            sortDirection={
              sortColumn === columnHeader.label ? sortDirection : null
            }
            onSort={() => onSort(columnHeader.label)}
          />
        </div>
      ))}
    </div>
  );
};
