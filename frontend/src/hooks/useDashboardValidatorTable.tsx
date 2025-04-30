import type { ValidatorDetails, ValidatorStatus } from "pec/types/validator";
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

  const statusFilteredData = useMemo(() => {
    if (statusFilter.length === 0) return filteredData;

    return (
      data?.filter((validator) => {
        return statusFilter.includes(validator.status);
      }) || []
    );
  }, [data, filteredData, statusFilter]);

  const getValidatorCount = (status: ValidatorStatus) => {
    return groupedValidators[status]?.length ?? 0;
  };

  const handleStatusFilterChange = (status: string) => {
    if (statusFilter.includes(status))
      setStatusFilter(statusFilter.filter((s) => s !== status));
    else setStatusFilter([...statusFilter, status]);
  };

  return {
    // State
    searchTerm,
    statusFilter,
    filteredData: statusFilteredData,

    // Handlers
    handleStatusFilterChange,
    handleSearchChange: setSearchTerm,
    getValidatorCount,
  };
}
