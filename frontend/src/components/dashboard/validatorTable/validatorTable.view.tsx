"use client";

import { useState, FC } from "react";
import { IValidatorTable, ValidatorStatus } from "pec/types/validator";
import { AlignLeft, CircleCheck, MoreVertical, Search } from "lucide-react";
import { Button } from "pec/components/ui/button";
import { Input } from "pec/components/ui/input";
import { Badge } from "pec/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "pec/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "pec/components/ui/table";
import { Checkbox } from "pec/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "pec/components/ui/pagination";
import { CirclePlus, CircleMinus, SlidersHorizontal } from "lucide-react";

export const ValidatorTableView: FC<IValidatorTable> = (props) => {
  const { data } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>(["Active"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const itemsPerPage = 10;

  // Filter data based on search term and status filter
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

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key as keyof typeof a];
    const bValue = b[sortConfig.key as keyof typeof b];

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(paginatedData.map((item) => item.publicKey));
    } else {
      setSelectedRows([]);
    }
  };

  const handleToggleRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }

    setSortConfig({ key, direction });
  };

  const handleStatusFilterChange = (status: string) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter((s) => s !== status));
    } else {
      setStatusFilter([...statusFilter, status]);
    }
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="w-full sm:w-96">
          <Input
            placeholder="Search validators..."
            className="rounded-xl pl-8 text-gray-500 dark:text-white"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex gap-2">
          <div className="flex items-center gap-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 ps-4 pe-4 dark:border-gray-800 dark:bg-black">
            <CirclePlus className="h-3 w-3 dark:text-white" />
            <span>Status</span>
            <div className="flex gap-1">
              {Object.values(ValidatorStatus).map((status) => (
                <Badge
                  key={status}
                  variant={
                    statusFilter.includes(status) ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => handleStatusFilterChange(status)}
                >
                  {status}
                </Badge>
              ))}
            </div>
          </div>

          <Button className="rounded-xl border-gray-200 dark:border-gray-800" variant="outline">
            <SlidersHorizontal className="h-3 w-3 dark:text-white" />
            <div>View</div>
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    paginatedData.length > 0 &&
                    selectedRows.length === paginatedData.length
                  }
                  onCheckedChange={handleToggleAll}
                  aria-label="Select all"
                />
              </TableHead>

              <TableHead
                onClick={() => handleSort("id")}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  Validator
                  {sortConfig?.key === "id" && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </TableHead>

              <TableHead
                onClick={() => handleSort("activeDate")}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  Active since
                  {sortConfig?.key === "activeDate" && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </TableHead>

              <TableHead
                onClick={() => handleSort("balance")}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  Balance
                  {sortConfig?.key === "balance" && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </TableHead>

              <TableHead
                onClick={() => handleSort("apy")}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  APY
                  {sortConfig?.key === "apy" && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </TableHead>

              <TableHead
                onClick={() => handleSort("status")}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  Status
                  {sortConfig?.key === "status" && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </TableHead>

              <TableHead
                onClick={() => handleSort("credentials")}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  Credentials
                  {sortConfig?.key === "credentials" && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((validator) => (
                <TableRow key={validator.publicKey}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(
                        validator.validatorIndex.toString(),
                      )}
                      onCheckedChange={(checked) =>
                        handleToggleRow(
                          validator.validatorIndex.toString(),
                          !!checked,
                        )
                      }
                      aria-label={`Select validator ${validator.validatorIndex}`}
                    />
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span>◆ {validator.validatorIndex}</span>
                      <span className="text-xs text-gray-500">
                        {validator.publicKey.slice(0, 7)}...
                        {validator.publicKey.slice(-5)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span>{validator.activeSince}</span>
                      <span className="text-xs text-gray-500">
                        {validator.activeDuration}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <AlignLeft className="h-3 w-3 text-gray-500" />
                      <span> {validator.balance}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span>{validator.apy}%</span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          validator.status === "Active"
                            ? "bg-green-500"
                            : validator.status === ValidatorStatus.PENDING
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                      <span>{validator.status}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      {validator.withdrawalAddress.includes("0x02") ? (
                        <CircleCheck className="h-4 w-4 text-green-500" />
                      ) : (
                        <CircleMinus className="h-4 w-4 text-red-500" />
                      )}
                      <div>
                        {validator.withdrawalAddress.includes("0x02")
                          ? "0x02 (Pectra)"
                          : "0x01 (Old)"}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="bg-white" align="end">
                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-500">
                          Deposit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-500">
                          Withdraw
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-500">
                          View on Beaconscan
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="py-4 text-center">
                  No validators found matching your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing{" "}
          {filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} validators
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                if (totalPages <= 7) return true;
                return (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
                );
              })
              .map((page, i, arr) => {
                const prev = arr[i - 1] || 0;
                if (prev !== page - 1 && prev !== 0) {
                  return (
                    <div key={`ellipsis-${page}`}>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    </div>
                  );
                }

                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
