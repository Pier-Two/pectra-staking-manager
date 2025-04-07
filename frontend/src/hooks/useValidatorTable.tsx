import { useState, useMemo } from "react";
import { ESortDirection, type SortConfig } from "pec/types/validatorTable";
import type { ValidatorDetails } from "pec/types/validator";

export function useValidatorTable(data: ValidatorDetails[], itemsPerPage = 10) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const filteredData = useMemo(() => {
    return (
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
      }) || []
    );
  }, [data, searchTerm, statusFilter]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (!sortConfig) return 0;

      const aValue = a[sortConfig.key as keyof typeof a] as number;
      const bValue = b[sortConfig.key as keyof typeof b] as number;

      if (aValue < bValue)
        return sortConfig.direction === ESortDirection.ASC ? -1 : 1;

      if (aValue > bValue)
        return sortConfig.direction === ESortDirection.ASC ? 1 : -1;

      return 0;
    });
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (key: string) => {
    let direction = ESortDirection.ASC;

    if (sortConfig && sortConfig.key === key) {
      direction =
        sortConfig.direction === ESortDirection.ASC
          ? ESortDirection.DESC
          : ESortDirection.ASC;
    }
    setSortConfig({ key, direction });
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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return {
    // State
    searchTerm,
    statusFilter,
    currentPage,
    sortConfig,
    filteredData,
    paginatedData,
    totalPages,

    // Handlers
    handleSort,
    handleStatusFilterChange,
    handleSearchChange,
    handlePageChange,
  };
}
