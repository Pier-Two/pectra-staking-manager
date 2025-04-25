import type { ValidatorDetails, ValidatorStatus } from "pec/types/validator";
import type { IHeaderConfig } from "pec/types/validatorTable";
import { useMemo, useState } from "react";
import { useSearch } from "./useSearch";

interface UseDashboardValidatorTable {
  data: ValidatorDetails[];
  groupedValidators: Partial<Record<ValidatorStatus, ValidatorDetails[]>>;
}

export function useDashboardValidatorTable({
  data,
  groupedValidators,
}: UseDashboardValidatorTable) {
  const { filteredData, searchTerm, setSearchTerm } = useSearch({
    data,
  });

  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [filterTableOptions, setFilterTableOptions] = useState<
    IHeaderConfig["label"][]
  >([]);

  const statusFilteredData = useMemo(() => {
    if (statusFilter.length === 0) return filteredData;

    return (
      data?.filter((validator) => {
        return statusFilter.includes(validator.status);
      }) || []
    );
  }, [data, filteredData, statusFilter]);

  const getValidatorCount = (status: ValidatorStatus) => {
    return groupedValidators[status]?.length || 0;
  };

  const handleStatusFilterChange = (status: string) => {
    if (statusFilter.includes(status))
      setStatusFilter(statusFilter.filter((s) => s !== status));
    else setStatusFilter([...statusFilter, status]);
  };

  const handleFilterTableOptionsChange = (option: IHeaderConfig["label"]) => {
    if (filterTableOptions.includes(option))
      setFilterTableOptions(filterTableOptions.filter((v) => v !== option));
    else setFilterTableOptions([...filterTableOptions, option]);
  };

  return {
    // State
    filterTableOptions,
    searchTerm,
    statusFilter,
    filteredData: statusFilteredData,

    // Handlers
    handleStatusFilterChange,
    handleSearchChange: setSearchTerm,
    getValidatorCount,
    handleFilterTableOptionsChange,
  };
}
