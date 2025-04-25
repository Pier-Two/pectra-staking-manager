"use client";

import { useDashboardValidatorTable } from "pec/hooks/useValidatorTable";
import type { IGenericValidators } from "pec/types/validator";
import type { FC } from "react";
import { TableFilters } from "./TableFilters";
import { DASHBOARD_VALIDATOR_COLUMN_HEADERS } from "pec/constants/columnHeaders";
import { ValidatorTable } from "pec/components/ui/table/ValidatorTable";

export const DashboardValidatorTable: FC<IGenericValidators> = (props) => {
  const { validators } = props;
  const {
    searchTerm,
    statusFilter,
    filterTableOptions,
    filteredData,
    handleStatusFilterChange,
    handleSearchChange,
    handleFilterTableOptionsChange,
    getValidatorCount,
  } = useDashboardValidatorTable(validators);

  return (
    <ValidatorTable
      data={filteredData}
      headers={DASHBOARD_VALIDATOR_COLUMN_HEADERS}
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
          filterTableOptions={filterTableOptions}
          onFilterTableOptionsChange={handleFilterTableOptionsChange}
          getValidatorCount={getValidatorCount}
        />
      )}
    </ValidatorTable>
  );
};
