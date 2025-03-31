"use client";

import type { FC } from "react";
import { TableFilters } from "./TableFilters";
import { TablePagination } from "./TablePagination";
import { ValidatorTableContent } from "./ValidatorTableContent";
import { useValidatorTable } from "pec/hooks/useValidatorTable";
import type { IGenericValidators } from "pec/types/validator";

export const ValidatorTable: FC<IGenericValidators> = (props) => {
  const { validators } = props;
  const {
    searchTerm,
    statusFilter,
    currentPage,
    sortConfig,
    filteredData,
    paginatedData,
    totalPages,
    handleSort,
    handleStatusFilterChange,
    handleSearchChange,
    handlePageChange,
  } = useValidatorTable(validators);

  const itemsPerPage = 10;

  return (
    <div className="space-y-4">
      <TableFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />

      <ValidatorTableContent
        paginatedData={paginatedData}
        sortConfig={sortConfig}
        onSort={handleSort}
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
