import type { ValidatorDetails } from "./validator";

export enum ESortDirection {
  ASC = "asc",
  DESC = "desc",
}

export interface ITableHeaderProps {
  label: string;
  sortKey: string;
  sortConfig: {
    key: string;
    direction: ESortDirection;
  } | null;
  onSort: (key: string) => void;
}

export interface ITableFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string[];
  onStatusFilterChange: (status: string) => void;
}

export interface IValidatorRowProps {
  validator: ValidatorDetails;
  isSelected: boolean;
  onToggle: (checked: boolean) => void;
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
  paginatedData: ValidatorDetails[];
  selectedRows: string[];
  sortConfig: SortConfig | null;
  onToggleAll: (checked: boolean) => void;
  onSort: (key: string) => void;
}

export interface IHeaderConfig {
  label: string;
  sortKey: string;
}
export interface IValidatorTableContentProps {
  paginatedData: ValidatorDetails[];
  selectedRows: string[];
  sortConfig: SortConfig | null;
  onToggleAll: (checked: boolean) => void;
  onToggleRow: (id: string, checked: boolean) => void;
  onSort: (key: string) => void;
}
