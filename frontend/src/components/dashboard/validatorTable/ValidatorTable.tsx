"use client";

import { useDashboardValidatorTable } from "pec/hooks/useValidatorTable";
import type { IGenericValidators } from "pec/types/validator";
import type { FC } from "react";
import { TableFilters } from "./TableFilters";
import { TablePagination } from "../../ui/table/TablePagination";
import { TableHeader } from "pec/components/ui/table/TableHeader";
import { ValidatorRow } from "./ValidatorRow";
import { TableNoResults } from "./TableNoResults";

export const ValidatorTable: FC<IGenericValidators> = (props) => {
  const { validators } = props;
  const {
    searchTerm,
    statusFilter,
    filterTableOptions,
    currentPage,
    sortConfig,
    filteredData,
    paginatedData,
    totalPages,
    handleSort,
    handleStatusFilterChange,
    handleSearchChange,
    handlePageChange,
    handleFilterTableOptionsChange,
    getValidatorCount,
  } = useDashboardValidatorTable(validators);

  const itemsPerPage = 10;

  return (
    <div className="space-y-6">
      <TableFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        filterTableOptions={filterTableOptions}
        onFilterTableOptionsChange={handleFilterTableOptionsChange}
        getValidatorCount={getValidatorCount}
      />

      <TableHeader
        sortConfig={sortConfig}
        onSort={handleSort}
        filterTableOptions={filterTableOptions}
      />
      <div className="flex flex-col gap-2">
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

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
