"use client";

import type { FC } from "react";
import { TableFilters } from "./TableFilters";
import { TablePagination } from "./TablePagination";
import { ValidatorTableContent } from "./ValidatorTableContent";
import { useValidatorTable } from "pec/hooks/useValidatorTable";
import { useWalletAddress } from "pec/hooks/useWallet";
import { api } from "pec/trpc/react";

export const ValidatorTable: FC = () => {
  const walletAddress = useWalletAddress();
  const { data } = api.validators.getValidators.useQuery({
    address: walletAddress,
  });

  const {
    searchTerm,
    statusFilter,
    currentPage,
    selectedRows,
    sortConfig,
    filteredData,
    paginatedData,
    totalPages,
    handleToggleAll,
    handleToggleRow,
    handleSort,
    handleStatusFilterChange,
    handleSearchChange,
    handlePageChange,
  } = useValidatorTable(data ?? []);

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
        selectedRows={selectedRows}
        sortConfig={sortConfig}
        onToggleAll={handleToggleAll}
        onToggleRow={handleToggleRow}
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
