import type { FC } from "react";
import { TableHead, TableRow } from "pec/components/ui/table";
import { TableHeader } from "./TableHeader";
import type {
  IHeaderConfig,
  ITableHeadersRowProps,
} from "pec/types/validatorTable";

export const TableHeadersRow: FC<ITableHeadersRowProps> = (props) => {
  const { sortConfig, onSort } =
    props;

  const headers: IHeaderConfig[] = [
    { label: "Validator", sortKey: "validatorIndex" },
    { label: "Active since", sortKey: "activeSince" },
    { label: "Credentials", sortKey: "withdrawalAddress" },
    { label: "Status", sortKey: "status" },
    { label: "Balance", sortKey: "balance" },
  ];

  return (
    <TableRow>
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
