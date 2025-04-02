import type { FC } from "react";
import { ColumnHeader } from "./ColumnHeader";
import type { IValidatorListHeaders } from "pec/types/batch-deposits";

export const ValidatorListHeaders: FC<IValidatorListHeaders> = (props) => {
  const { columnHeaders, onSort, sortColumn, sortDirection } = props;

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
