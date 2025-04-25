"use client";

import { useDashboardValidatorTable } from "pec/hooks/useDashboardValidatorTable";
import type { FC } from "react";
import { TableFilters } from "./TableFilters";
import { DASHBOARD_VALIDATOR_COLUMN_HEADERS } from "pec/constants/columnHeaders";
import { ValidatorTable } from "pec/components/ui/table/ValidatorTable";
import { ValidatorRowEndContent } from "./TableComponents";
import { ValidatorDetails, ValidatorStatus } from "pec/types/validator";

interface IGenericValidators {
  data: ValidatorDetails[];
  groupedValidators: Partial<Record<ValidatorStatus, ValidatorDetails[]>>;
}

export const DashboardValidatorTable: FC<IGenericValidators> = (props) => {
  const {
    searchTerm,
    statusFilter,
    filterTableOptions,
    filteredData,
    handleStatusFilterChange,
    handleSearchChange,
    handleFilterTableOptionsChange,
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
          filterTableOptions={filterTableOptions}
          onFilterTableOptionsChange={handleFilterTableOptionsChange}
          getValidatorCount={getValidatorCount}
        />
      )}
    </ValidatorTable>
  );
};
