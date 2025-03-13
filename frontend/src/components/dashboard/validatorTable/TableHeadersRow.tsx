// src/components/validator/TableHeadersRow.tsx
import { FC } from "react";
import { TableHead, TableRow } from "pec/components/ui/table";
import { Checkbox } from "pec/components/ui/checkbox";
import { TableHeader } from "./TableHeader";
import { IHeaderConfig, ITableHeadersRowProps } from "pec/types/validatorTable";

export const TableHeadersRow: FC<ITableHeadersRowProps> = (props) => {
  const { paginatedData, selectedRows, sortConfig, onToggleAll, onSort } =
    props;
    
  const headers: IHeaderConfig[] = [
    { label: "Validator", sortKey: "id" },
    { label: "Active since", sortKey: "activeDate" },
    { label: "Balance", sortKey: "balance" },
    { label: "APY", sortKey: "apy" },
    { label: "Status", sortKey: "status" },
    { label: "Credentials", sortKey: "credentials" },
  ];

  return (
    <TableRow>
      <TableHead className="w-12">
        <Checkbox
          className="rounded"
          checked={
            paginatedData.length > 0 &&
            selectedRows.length === paginatedData.length
          }
          onCheckedChange={onToggleAll}
          aria-label="Select all"
        />
      </TableHead>

      {headers.map((header) => (
        <TableHeader
          key={header.sortKey}
          label={header.label}
          sortKey={header.sortKey}
          sortConfig={sortConfig}
          onSort={onSort}
        />
      ))}

      <TableHead className="w-12"></TableHead>
    </TableRow>
  );
};
