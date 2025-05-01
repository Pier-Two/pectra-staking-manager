import type { FC } from "react";

import { TableCell, TableRow } from "pec/components/ui/table";

export const TableNoResults: FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={8} className="py-4 text-center">
        No validators found matching your search criteria.
      </TableCell>
    </TableRow>
  );
};
