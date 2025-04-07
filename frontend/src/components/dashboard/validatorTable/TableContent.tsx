import type { FC } from "react";
import type { IValidatorTableContentProps } from "pec/types/validatorTable";
import { TableHeader } from "./TableHeader";
import { ValidatorRow } from "./ValidatorRow";
import { TableNoResults } from "./TableNoResults";

export const TableContent: FC<IValidatorTableContentProps> = ({
  paginatedData,
  sortConfig,
  onSort,
}) => {
  return (
    <div className="space-y-4">
      <TableHeader sortConfig={sortConfig} onSort={onSort} />
      {paginatedData.length > 0 ? (
        paginatedData.map((validator) => (
          <ValidatorRow key={validator.publicKey} validator={validator} />
        ))
      ) : (
        <TableNoResults />
      )}
    </div>
  );
};
