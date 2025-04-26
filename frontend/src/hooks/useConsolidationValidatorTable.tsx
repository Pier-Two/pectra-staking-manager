import { ValidatorDetails } from "pec/types/validator";
import { useValidatorSorting } from "./use-validator-sorting";
import { usePagination } from "./use-pagination";

export const useConsolidationValidatorTable = (data: ValidatorDetails[]) => {
  const { sortedValidators, setSortConfig, sortConfig } = useValidatorSorting({
    validators: data,
  });

  const { currentPage, setCurrentPage, paginatedData, totalPages } =
    usePagination({
      data: sortedValidators,
    });

  return {
    sortedValidators,
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages,
    setSortConfig,
    sortConfig,
  };
};
