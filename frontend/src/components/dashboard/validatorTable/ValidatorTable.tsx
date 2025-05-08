"use client";

import { ValidatorTable } from "pec/components/ui/table/ValidatorTable";
import { DASHBOARD_VALIDATOR_COLUMN_HEADERS } from "pec/constants/columnHeaders";
import { useDashboardValidatorTable } from "pec/hooks/useDashboardValidatorTable";
import { ValidatorRowEndContent } from "./TableComponents";
import { TableFilters } from "./TableFilters";
import { DisplayAmount } from "pec/components/ui/table/TableComponents";

export const DashboardValidatorTable = () => {
  const {
    searchTerm,
    statusFilter,
    filteredData,
    handleStatusFilterChange,
    handleSearchChange,
    getValidatorCount,
    isLoading,
  } = useDashboardValidatorTable();

  return (
    <ValidatorTable
      data={filteredData}
      headers={DASHBOARD_VALIDATOR_COLUMN_HEADERS}
      endContent={(validator) => (
        <ValidatorRowEndContent validator={validator} />
      )}
      wrapperProps={{
        clearBackground: true,
      }}
      // We disable search here because we have a custom search component here
      disableSearch
      isLoading={isLoading}
      renderOverrides={{
        pendingBalance: (v) => (
          <DisplayAmount
            amount={v.pendingBalance}
            className="text-gray-500 dark:text-gray-500"
          />
        ),
      }}
    >
      {({ setCurrentPage }) => (
        <TableFilters
          searchTerm={searchTerm}
          onSearchChange={(term) => {
            handleSearchChange(term);
            setCurrentPage(1);
          }}
          statusFilter={statusFilter}
          onStatusFilterChange={(status) => {
            handleStatusFilterChange(status);
            setCurrentPage(1);
          }}
          getValidatorCount={getValidatorCount}
        />
      )}
    </ValidatorTable>
  );
};
