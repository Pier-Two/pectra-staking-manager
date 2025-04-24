import type { IValidatorTableContentProps } from "pec/types/validatorTable";
import type { FC } from "react";
import { TableHeader } from "./TableHeader";
import { TableNoResults } from "./TableNoResults";
import { ValidatorRow } from "./ValidatorRow";

export const TableContent: FC<IValidatorTableContentProps> = ({
  paginatedData,
  sortConfig,
  onSort,
  filterTableOptions,
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <TableHeader
        sortConfig={sortConfig}
        onSort={onSort}
        filterTableOptions={filterTableOptions}
      />
      {paginatedData.length > 0 ? (
        paginatedData.map((validator) => (
          <ValidatorRow
            key={validator.publicKey}
            validator={validator}
            filterTableOptions={filterTableOptions}
          />
        ))
      ) : (
        <TableNoResults />
      )}
    </div>
  );
};
