import { IHeaderConfig, TableValidatorDetails } from "pec/types/validatorTable";
import { TableHeader } from "./TableHeader";
import { useValidatorSorting } from "pec/hooks/use-validator-sorting";
import { TableNoResults } from "pec/components/dashboard/validatorTable/TableNoResults";
import { ValidatorRow } from "pec/components/ui/table/ValidatorRow";
import { usePagination } from "pec/hooks/use-pagination";
import { ReactNode } from "react";
import { TablePagination } from "./TablePagination";
import { ValidatorCardWrapperProps } from "../custom/validator-card-wrapper";
import { useSearch } from "pec/hooks/useSearch";
import { SearchFilter } from "./SearchFilter";

interface ValidatorTableProps<T extends TableValidatorDetails> {
  data: T[];
  headers: IHeaderConfig<T>[];
  wrapperProps?: Omit<ValidatorCardWrapperProps, "onClick" | "children">;
  selectableRows?: {
    onClick: (validator: T) => void;
    isSelected: (validator: T) => boolean;
    showCheckIcons: boolean;
  };
  endContent?: (data: T) => JSX.Element;
  children?: (params: { setCurrentPage: (page: number) => void }) => ReactNode;
  disableSearch?: boolean;
  disableSort?: boolean;
  renderOverrides?: Partial<Record<keyof T, (data: T) => JSX.Element>>;
}

export const ValidatorTable = <T extends TableValidatorDetails>({
  data,
  headers,
  endContent,
  children,
  selectableRows,
  wrapperProps,
  disableSearch,
  disableSort,
  renderOverrides,
}: ValidatorTableProps<T>) => {
  const { filteredData, searchTerm, setSearchTerm } = useSearch({
    data,
    disabled: disableSearch,
  });
  const { sortedValidators, sortConfig, setSortConfig } = useValidatorSorting({
    validators: filteredData,
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
      {!disableSearch && (
        <SearchFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      )}
      {children?.({ setCurrentPage })}
      <table className="table w-full table-auto border-separate border-spacing-y-2">
        {/* Render the pagination controls from the parent */}

        <TableHeader
          sortConfig={sortConfig}
          onSort={setSortConfig}
          headers={headers}
          disableSort={disableSort}
        />
        <tbody className="">
          {sortedValidators.length > 0 ? (
            paginatedData.map((validator) => (
              <ValidatorRow
                headers={headers}
                key={validator.publicKey}
                validator={validator}
                endContent={endContent}
                wrapperProps={wrapperProps}
                selectableRows={
                  selectableRows
                    ? {
                        ...selectableRows,
                        isSelected:
                          selectableRows.isSelected(validator) || false,
                      }
                    : undefined
                }
                renderOverrides={renderOverrides}
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
