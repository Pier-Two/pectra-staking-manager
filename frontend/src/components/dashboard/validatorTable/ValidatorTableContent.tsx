import type { FC } from "react";
import { TableNoResults } from "./TableNoResults";
import { ValidatorRow } from "./ValidatorRow";
import { TableHeadersRow } from "./TableHeadersRow";
import { Table, TableBody, TableHeader } from "pec/components/ui/table";
import type { IValidatorTableContentProps } from "pec/types/validatorTable";

export const ValidatorTableContent: FC<IValidatorTableContentProps> = (
  props,
) => {
  const {
    paginatedData,
    selectedRows,
    sortConfig,
    onToggleAll,
    onToggleRow,
    onSort,
  } = props;

  return (
    <Table className="rounded-xl bg-gray-50 text-gray-800 dark:bg-black dark:text-white">
      <TableHeader>
        <TableHeadersRow
          paginatedData={paginatedData}
          selectedRows={selectedRows}
          sortConfig={sortConfig}
          onToggleAll={onToggleAll}
          onSort={onSort}
        />
      </TableHeader>

      <TableBody>
        {paginatedData.length > 0 ? (
          paginatedData.map((validator) => (
            <ValidatorRow
              key={validator.publicKey}
              validator={validator}
              isSelected={selectedRows.includes(
                validator.validatorIndex.toString(),
              )}
              onToggle={(checked) =>
                onToggleRow(validator.validatorIndex.toString(), checked)
              }
            />
          ))
        ) : (
          <TableNoResults />
        )}
      </TableBody>
    </Table>
  );
};
