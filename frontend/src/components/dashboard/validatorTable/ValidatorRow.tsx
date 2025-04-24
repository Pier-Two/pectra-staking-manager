"use client";

import {
  ArrowDownToDot,
  ArrowUpFromDot,
  CircleCheck,
  CircleMinus,
  CirclePlay,
  MoreVertical,
  OctagonMinus,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "pec/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "pec/components/ui/dropdown-menu";
import { Separator } from "pec/components/ui/separator";
import { ValidatorStatus } from "pec/types/validator";
import type { IValidatorRowProps } from "pec/types/validatorTable";
import type { FC } from "react";
import { formatEther } from "viem";
import clsx from "clsx";
import { getGridTemplateColumns } from "./TableHeader";
import { displayedEthAmount } from "pec/lib/utils/validators/balance";
/**
 * @Description This is a component that renders a row of a validator in the validator table.
 *
 *
 * @param_validator - The validator object to render
 *
 * @param_filterTableOptions - The current filter Options for the table
 *   - Expected Functionality if an item is in the FilterTablesOptions array, ** IT SHOULD NOT BE RENDERED **
 *
 */
export const ValidatorRow: FC<IValidatorRowProps> = (props) => {
  const { validator, filterTableOptions } = props;
  const router = useRouter();

  const handleDepositNavigation = () => {
    router.push("/batch-deposit");
  };

  const handleWithdrawalNavigation = () => {
    router.push("/withdraw");
  };

  const handleBeaconscanNavigation = () => {
    window.open(
      `https://beaconscan.com/validator/${validator.validatorIndex}`,
      "_blank",
    );
  };

  const displayBalance = displayedEthAmount(
    Number(formatEther(validator.balance)),
  );

  return (
    <div className="w-full rounded-xl border bg-indigo-50 p-4 text-sm hover:border-indigo-300 dark:bg-black dark:hover:bg-gray-900">
      {/* Desktop View */}
      <div
        className={clsx(
          "hidden md:grid md:items-center md:gap-4",
          getGridTemplateColumns(filterTableOptions.length),
        )}
      >
        <div>
          <div className="flex flex-row gap-2">
            <Image
              src="/icons/EthValidator.svg"
              alt="Wallet"
              width={24}
              height={24}
            />
            <div className="flex flex-col">
              <div className="font-medium">{validator.validatorIndex}</div>
              <div className="text-xs text-gray-500">
                {validator.publicKey.slice(0, 7)}...
                {validator.publicKey.slice(-5)}
              </div>
            </div>
          </div>
        </div>

        {!filterTableOptions.includes("Active since") && (
          <div>
            <div className="flex flex-col">
              <span>{validator.activeSince}</span>
              <span className="text-xs text-gray-500">
                {validator.activeDuration}
              </span>
            </div>
          </div>
        )}

        <div>
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
        </div>

        {!filterTableOptions.includes("Status") && (
          <div>
            <div className="flex items-center gap-2">
              {validator.status === ValidatorStatus.ACTIVE ? (
                <CirclePlay className="h-4 w-4 fill-green-500 text-white dark:text-black" />
              ) : (
                <CircleMinus className="h-4 w-4 fill-red-500 text-white dark:text-black" />
              )}
              <span>{validator.status}</span>
            </div>
          </div>
        )}

        {!filterTableOptions.includes("Balance") && (
          <div className="font-semibold">Ξ {displayBalance} ETH</div>
        )}

        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4 rotate-90" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="space-y-2 rounded-xl bg-white p-2 dark:border-gray-500 dark:bg-gray-900 dark:text-white"
              align="end"
            >
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gray-100"
                onClick={handleDepositNavigation}
              >
                <ArrowDownToDot className="h-4 w-4 text-indigo-500 dark:text-indigo-300" />
                Deposit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gray-100"
                onClick={handleWithdrawalNavigation}
              >
                <ArrowUpFromDot className="h-4 w-4 text-green-500 dark:text-green-300" />
                Withdraw
              </DropdownMenuItem>
              <Separator className="bg-gray-200 dark:bg-gray-800" />
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gray-100"
                onClick={handleBeaconscanNavigation}
              >
                View on Beaconscan
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div>
            <div className="flex flex-row gap-2">
              <Image
                src="/icons/EthValidator.svg"
                alt="Wallet"
                width={24}
                height={24}
              />
              <div className="flex flex-col">
                <div className="font-medium">{validator.validatorIndex}</div>
                <div className="text-xs text-gray-500">
                  {validator.publicKey.slice(0, 7)}...
                  {validator.publicKey.slice(-5)}
                </div>
              </div>
            </div>
          </div>

          <div>
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
          </div>

          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4 rotate-90" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="space-y-2 rounded-xl bg-white p-2 dark:border-gray-500 dark:bg-gray-900 dark:text-white"
                align="end"
              >
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={handleDepositNavigation}
                >
                  <ArrowDownToDot className="h-4 w-4 text-indigo-500 dark:text-indigo-300" />
                  Deposit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={handleWithdrawalNavigation}
                >
                  <ArrowUpFromDot className="h-4 w-4 text-green-500 dark:text-green-300" />
                  Withdraw
                </DropdownMenuItem>
                <Separator className="bg-gray-200 dark:bg-gray-800" />
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={handleBeaconscanNavigation}
                >
                  View on Beaconscan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile View - Items Stacked */}
        <div className="mt-4 space-y-2 border-t pt-4 dark:border-gray-800">
          {!filterTableOptions.includes("Active since") && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Active since</span>
              <div className="flex flex-col items-end">
                <span>{validator.activeSince}</span>
                <span className="text-xs text-gray-500">
                  {validator.activeDuration}
                </span>
              </div>
            </div>
          )}

          {!filterTableOptions.includes("Status") && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Status</span>
              <div className="flex items-center gap-2">
                {validator.status === ValidatorStatus.ACTIVE ? (
                  <CirclePlay className="h-4 w-4 fill-green-500 text-white dark:text-black" />
                ) : (
                  <CircleMinus className="h-4 w-4 fill-red-500 text-white dark:text-black" />
                )}
                <span>{validator.status}</span>
              </div>
            </div>
          )}

          {!filterTableOptions.includes("Balance") && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Balance</span>
              <div className="font-semibold">Ξ {displayBalance} ETH</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
