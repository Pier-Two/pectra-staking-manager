import type { ValidatorDetails, ValidatorStatus } from "pec/types/validator";
import type { IHeaderConfig } from "pec/types/validatorTable";
import { useMemo, useState } from "react";
import { usePagination } from "./use-pagination";
import { useValidatorSorting } from "./use-validator-sorting";

export function useDashboardValidatorTable(data: ValidatorDetails[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [filterTableOptions, setFilterTableOptions] = useState<
    IHeaderConfig["label"][]
  >([]);

  const filteredData = useMemo(() => {
    const filteredData =
      data?.filter((validator) => {
        const matchesSearch =
          searchTerm === "" ||
          validator.validatorIndex
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          validator.publicKey.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter.length === 0 || statusFilter.includes(validator.status);

        return matchesSearch && matchesStatus;
      }) || [];

    return filteredData;
  }, [data, searchTerm, statusFilter]);

  const { sortedValidators, setSortConfig, sortConfig } = useValidatorSorting({
    validators: filteredData,
  });

  const { currentPage, setCurrentPage, paginatedData, totalPages } =
    usePagination({
      data: sortedValidators,
    });

  const getValidatorCount = (status: ValidatorStatus) => {
    return data.filter((validator) => validator.status === status).length;
  };

  const handleStatusFilterChange = (status: string) => {
    if (statusFilter.includes(status))
      setStatusFilter(statusFilter.filter((s) => s !== status));
    else setStatusFilter([...statusFilter, status]);
    setCurrentPage(1);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
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
    currentPage,
    sortConfig,
    filteredData,
    paginatedData,
    totalPages,

    // Handlers
    handleSort: setSortConfig,
    handleStatusFilterChange,
    handleSearchChange,
    handlePageChange: setCurrentPage,
    getValidatorCount,
    handleFilterTableOptionsChange,
  };
}
