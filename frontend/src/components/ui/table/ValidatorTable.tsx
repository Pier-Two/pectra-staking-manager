import { IHeaderConfig } from "pec/types/validatorTable";
import { TableHeader } from "./TableHeader";
import { ValidatorDetails } from "pec/types/validator";
import { useValidatorSorting } from "pec/hooks/use-validator-sorting";
import { TableNoResults } from "pec/components/dashboard/validatorTable/TableNoResults";
import { NewValidatorRow } from "pec/components/dashboard/validatorTable/NewValidatorRow";
import { usePagination } from "pec/hooks/use-pagination";
import { ReactNode } from "react";
import { TablePagination } from "./TablePagination";

interface ValidatorTableProps<T extends ValidatorDetails> {
  data: T[];
  headers: IHeaderConfig<T>[];
  children?: (params: { setCurrentPage: (page: number) => void }) => ReactNode;
}

export const ValidatorTable = <T extends ValidatorDetails>({
  data,
  headers,
  children,
}: ValidatorTableProps<T>) => {
  const { sortedValidators, sortConfig, setSortConfig } = useValidatorSorting({
    validators: data,
  });

  const {
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages,
    itemsPerPage,
  } = usePagination({
    data: sortedValidators,
  });

  return (
    <div className="flex flex-col gap-4">
      {children && children({ setCurrentPage })}
      <table className="table w-full table-auto">
        {/* Render the pagination controls from the parent */}

        <TableHeader
          sortConfig={sortConfig}
          onSort={setSortConfig}
          headers={headers}
        />
        <tbody>
          {sortedValidators.length > 0 ? (
            paginatedData.map((validator) => (
              <NewValidatorRow
                headers={headers}
                key={validator.publicKey}
                validator={validator}
              />
            ))
          ) : (
            <TableNoResults />
          )}
        </tbody>
      </table>
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={sortedValidators.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
