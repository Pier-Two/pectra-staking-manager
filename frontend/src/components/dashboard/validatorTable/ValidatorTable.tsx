"use client";

import { useValidatorTable } from "pec/hooks/useValidatorTable";
import type { IGenericValidators } from "pec/types/validator";
import type { FC } from "react";
import { TableContent } from "./TableContent";
import { TableFilters } from "./TableFilters";
import { TablePagination } from "./TablePagination";

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
  } = useValidatorTable(validators);

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

      <TableContent
        paginatedData={paginatedData}
        sortConfig={sortConfig}
        onSort={handleSort}
        filterTableOptions={filterTableOptions}
      />

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
