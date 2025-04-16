import type { ValidatorDetails } from "./validator";

export enum ESortDirection {
  ASC = "asc",
  DESC = "desc",
}

export interface ITableFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string[];
  onStatusFilterChange: (status: string) => void;
  filterTableOptions: IHeaderConfig['label'][];
  onFilterTableOptionsChange: (option: IHeaderConfig['label']) => void;
}

export interface IValidatorRowProps {
  validator: ValidatorDetails;
  filterTableOptions: IHeaderConfig['label'][];
}

export interface ITablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export interface SortConfig {
  key: string;
  direction: ESortDirection;
}

export interface ITableHeadersRowProps {
  sortConfig: SortConfig | null;
  onSort: (key: string) => void;
  filterTableOptions: IHeaderConfig['label'][];
}

export interface IHeaderConfig {
  label: string;
  sortKey: string;
}
export interface IValidatorTableContentProps {
  paginatedData: ValidatorDetails[];
  sortConfig: SortConfig | null;
  onSort: (key: string) => void;
  filterTableOptions: IHeaderConfig['label'][];
}
