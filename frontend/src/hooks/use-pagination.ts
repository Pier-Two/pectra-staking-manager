import { useMemo, useState } from "react";

interface UsePaginationProps<T> {
  itemsPerPage?: number;
  data: T[];
}

export const usePagination = <T>({
  itemsPerPage = 5,
  data,
}: UsePaginationProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedData = useMemo(() => {
    return data.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [data, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);

  return {
    paginatedData,
    currentPage,
    setCurrentPage: handlePageChange,
    totalPages,
    itemsPerPage,
  };
};
