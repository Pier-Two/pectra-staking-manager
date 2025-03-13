import { FC } from "react";
import { TableCell, TableRow } from "pec/components/ui/table";
import { Checkbox } from "pec/components/ui/checkbox";
import { Button } from "pec/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "pec/components/ui/dropdown-menu";
import { AlignLeft, Check, CircleMinus, MoreVertical } from "lucide-react";
import { ValidatorStatus } from "pec/types/validator";
import { IValidatorRowProps } from "pec/types/validatorTable";

export const ValidatorRow: FC<IValidatorRowProps> = (props) => {
  const { validator, isSelected, onToggle } = props;

  return (
    <TableRow className="border-none hover:bg-gray-50 dark:hover:bg-gray-800">
      <TableCell>
        <Checkbox
          className="rounded"
          checked={isSelected}
          onCheckedChange={(checked) => onToggle(!!checked)}
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
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <CircleMinus className="h-4 w-4 fill-red-500 text-red-500 text-white" />
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
  );
};
