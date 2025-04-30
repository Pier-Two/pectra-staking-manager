"use client";

import { ValidatorTable } from "pec/components/ui/table/ValidatorTable";
import { DASHBOARD_VALIDATOR_COLUMN_HEADERS } from "pec/constants/columnHeaders";
import { useDashboardValidatorTable } from "pec/hooks/useDashboardValidatorTable";
import type { ValidatorDetails, ValidatorStatus } from "pec/types/validator";
import type { FC } from "react";
import { ValidatorRowEndContent } from "./TableComponents";
import { TableFilters } from "./TableFilters";

interface IGenericValidators {
  data: ValidatorDetails[];
  groupedValidators: Partial<Record<ValidatorStatus, ValidatorDetails[]>>;
}

export const DashboardValidatorTable: FC<IGenericValidators> = (props) => {
  const {
    searchTerm,
    statusFilter,
    filteredData,
    handleStatusFilterChange,
    handleSearchChange,
    getValidatorCount,
  } = useDashboardValidatorTable(props);

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
