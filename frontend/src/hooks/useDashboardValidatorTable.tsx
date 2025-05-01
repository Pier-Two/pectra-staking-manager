import { useMemo, useState } from "react";

import type { ValidatorStatus } from "pec/types/validator";

import { useSearch } from "./useSearch";
import { useValidators } from "./useValidators";

export function useDashboardValidatorTable() {
  const { data, groupedValidators, isLoading } = useValidators();

  const { filteredData, searchTerm, setSearchTerm } = useSearch({
    data: data ?? [],
  });

  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const statusFilteredData = useMemo(() => {
    if (statusFilter.length === 0) return filteredData;

    return (
      data?.filter((validator) => {
        return statusFilter.includes(validator.status);
      }) ?? []
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

    // Loading
    isLoading,
  };
}
