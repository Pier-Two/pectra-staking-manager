import {
  type IHeaderConfig,
  type TableValidatorDetails,
} from "pec/types/validatorTable";
import { TableHeader } from "./TableHeader";
import { useValidatorSorting } from "pec/hooks/use-validator-sorting";
import { TableNoResults } from "pec/components/dashboard/validatorTable/TableNoResults";
import { ValidatorRow } from "pec/components/ui/table/ValidatorRow";
import { usePagination } from "pec/hooks/use-pagination";
import { type ReactNode } from "react";
import { TablePagination } from "./TablePagination";
import { type ValidatorCardWrapperProps } from "../custom/validator-card-wrapper";
import { useSearch } from "pec/hooks/useSearch";
import { SearchFilter } from "./SearchFilter";
import { TableRow, TableCell } from "../table";
import { EnterAnimation } from "pec/app/(login-layout)/welcome/_components/enter-animation";

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
  disablePagination?: boolean;
  renderOverrides?: Partial<Record<keyof T, (data: T) => JSX.Element>>;
  isLoading?: boolean;
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
  disablePagination,
  renderOverrides,
  isLoading,
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
    disabled: disablePagination,
  });

  if (isLoading) return null;

  return (
    <EnterAnimation>
      <div className="flex flex-col">
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
              paginatedData.map((validator, index) => (
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
                  index={index}
                />
              ))
            ) : (
              <TableNoResults />
            )}
          </tbody>
        </table>
        {!disablePagination && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedValidators.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </EnterAnimation>
  );
};
