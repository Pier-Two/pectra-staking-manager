import type { SortDirection } from "pec/components/batch-deposits/validators/ColumnHeader";
import { WithdrawWorkflowStages } from "pec/types/withdraw";
import { ColumnHeader } from "./ColumnHeader";

interface IColumnHeader {
  label: string;
  showSort: boolean;
}

export interface IValidatorListHeaders {
  columns: readonly IColumnHeader[];
  sortColumn: string | null;
  sortDirection: SortDirection;
  stage?: WithdrawWorkflowStages;
  onSort: (column: string) => void;
}

export const ValidatorListHeaders = ({
  columns,
  stage,
  onSort,
  sortColumn,
  sortDirection,
}: IValidatorListHeaders) => {

  const signSubmitFinaliseInProgress = stage?.type === "sign-submit-finalise";

  // If we are in the sign-submit-finalise stage, we should only display the validator
  const columnHeaders = signSubmitFinaliseInProgress ? columns.filter((column) => column.label === "Validator") : columns;
  
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
