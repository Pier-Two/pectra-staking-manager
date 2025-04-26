import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "pec/components/ui/pagination";
import type { FC } from "react";

const getVisiblePages = (currentPage: number, totalPages: number): number[] => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (totalPages <= 7) return pages;

  return pages.filter(
    (page) =>
      page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1,
  );
};

export interface ITablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const TablePagination: FC<ITablePaginationProps> = (props) => {
  const { currentPage, totalPages, totalItems, itemsPerPage, onPageChange } =
    props;

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex w-full flex-col-reverse items-center justify-between gap-x-4 sm:flex-row">
      <div className="flex flex-row gap-x-1 text-sm text-gray-500 dark:text-gray-300">
        <div>Showing</div>
        <div>{totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</div>
        <div>to</div>
        <div>{Math.min(currentPage * itemsPerPage, totalItems)}</div>
        <div>of</div>
        <div>{totalItems}</div>
        <div>validators</div>
      </div>

      <Pagination className="justify-center pb-4 sm:justify-end sm:pb-0">
        <PaginationContent className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-800 dark:bg-black">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(currentPage - 1)}
              className={`rounded-lg px-2 py-1 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                currentPage === 1
                  ? "pointer-events-none text-gray-300 dark:text-gray-700"
                  : "cursor-pointer text-gray-700 dark:text-gray-300"
              }`}
            />
          </PaginationItem>

          {visiblePages.map((page, index, arr) => {
            const prevPage = arr[index - 1] ?? 0;
            const shouldShowEllipsis = prevPage !== page - 1 && prevPage !== 0;

            return (
              <div key={page + index}>
                {shouldShowEllipsis && (
                  <PaginationItem key={`ellipsis-${page}`}>
                    <PaginationEllipsis className="text-gray-500 dark:text-gray-400" />
                  </PaginationItem>
                )}

                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => onPageChange(page)}
                    className={`rounded-lg border-none px-3 py-1 text-sm hover:cursor-pointer ${
                      page === currentPage ? "font-medium text-blue-500" : ""
                    }`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              </div>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(currentPage + 1)}
              className={`rounded-lg px-2 py-1 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                currentPage === totalPages
                  ? "pointer-events-none text-gray-300 dark:text-gray-700"
                  : "cursor-pointer text-gray-700 dark:text-gray-300"
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
