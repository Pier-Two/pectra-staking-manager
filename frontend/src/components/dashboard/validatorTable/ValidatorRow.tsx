import type { FC } from "react";
import Image from "next/image";
import { TableCell, TableRow } from "pec/components/ui/table";
import { Checkbox } from "pec/components/ui/checkbox";
import { Button } from "pec/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "pec/components/ui/dropdown-menu";
import {
  AlignLeft,
  CircleCheck,
  CircleMinus,
  CirclePlay,
  MoreVertical,
  OctagonMinus,
} from "lucide-react";
import { ValidatorStatus } from "pec/types/validator";
import type { IValidatorRowProps } from "pec/types/validatorTable";

export const ValidatorRow: FC<IValidatorRowProps> = (props) => {
  const { validator, isSelected, onToggle } = props;

  return (
    <TableRow
      className={`hover:bg-indigo-100 ${isSelected ? "bg-indigo-100" : "bg-white dark:bg-black"}`}
    >
      <TableCell>
        <Checkbox
          className={`rounded text-black dark:text-black ${isSelected ? "bg-blue-300" : "bg-white dark:bg-black"}`}
          checked={isSelected}
          onCheckedChange={(checked) => onToggle(!!checked)}
          aria-label={`Select validator ${validator.validatorIndex}`}
        />
      </TableCell>

      <TableCell>
        <div className="flex flex-row gap-2">
          <Image
            src="/icons/EthValidator.svg"
            alt="Wallet"
            width={24}
            height={24}
          />
          <div className="flex flex-col">
            <div className="font-semibold">{validator.validatorIndex}</div>
            <span className="text-xs text-gray-500">
              {validator.publicKey.slice(0, 7)}...
              {validator.publicKey.slice(-5)}
            </span>
          </div>
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
          {validator.withdrawalAddress.includes("0x02") ? (
            <CircleCheck className="h-4 w-4 fill-green-500 text-white dark:text-black" />
          ) : (
            <OctagonMinus className="h-4 w-4 text-gray-500 dark:text-white" />
          )}
          <div className="font-semibold">
            {validator.withdrawalAddress.slice(0, 4)}
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          {validator.status === ValidatorStatus.ACTIVE ? (
            <CirclePlay className="h-4 w-4 fill-green-500 text-white dark:text-black" />
          ) : (
            <CircleMinus className="h-4 w-4 fill-red-500 text-white dark:text-black" />
          )}
          <span>{validator.status}</span>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-1">
          <AlignLeft className="h-3 w-3" />
          <div className="font-semibold">{validator.balance}</div>
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
