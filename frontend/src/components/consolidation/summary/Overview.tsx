"use client";

import { Info } from "lucide-react";
import { PectraSpinner } from "pec/components/ui/custom/pectraSpinner";
import { Separator } from "pec/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "pec/components/ui/tooltip";
import { useConsolidationFee } from "pec/hooks/use-consolidation";
import { formatEther, parseEther } from "viem";
import { displayedEthAmount } from "pec/lib/utils/validators/balance";
import { type ValidatorDetails } from "pec/types/validator";
import { sumBy } from "lodash";

interface OverviewProps {
  sourceValidators: ValidatorDetails[];
  destinationValidator: ValidatorDetails;
  upgradeTransactions: number;
  consolidationTransactions: number;
}

export const Overview = ({
  sourceValidators,
  destinationValidator,
  upgradeTransactions,
  consolidationTransactions,
}: OverviewProps) => {
  const { data: consolidationFee, isLoading: isLoadingConsolidationFee } =
    useConsolidationFee();

  const totalSourceValidators = sourceValidators.length;

  const newTotalBalance =
    destinationValidator.balance + sumBy(sourceValidators, (v) => v.balance);

  const totalTransactions = upgradeTransactions + consolidationTransactions;

  const estimatedGasFee = consolidationFee
    ? consolidationFee * BigInt(totalTransactions)
    : BigInt(0);

  return (
    <div className="flex min-h-[10vh] w-full flex-col justify-between gap-x-4 space-y-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black">
      <div className="flex items-end gap-x-2 text-sm">
        <span>
          Consolidate{" "}
          <span className="font-bold">
            {totalSourceValidators + 1} validator
            {totalSourceValidators <= 1 ? "" : "s"}
          </span>{" "}
          into <span className="font-bold">one</span> with a new total balance
          of
        </span>

        <div className="flex items-center gap-1">
          <div className="font-semibold">
            Ξ {displayedEthAmount(newTotalBalance, 2)}
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 fill-gray-400 text-white dark:fill-gray-600 dark:text-black" />
              </TooltipTrigger>

              <TooltipContent className="flex flex-col rounded-xl bg-black text-white dark:bg-white dark:text-black">
                <span>All validators with 0x01</span>
                <span>credentials set require a</span>
                <span>consolidation, including the</span>
                <span>destination validator.</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Separator className="bg-gray-200 dark:bg-gray-800" />

      <div className="flex w-full flex-col space-y-2">
        <div className="flex flex-row justify-between">
          <div className="text-sm text-zinc-700 dark:text-zinc-300">
            Estimated gas fee ({totalTransactions}x consolidations)
          </div>

          <div className="flex items-center gap-1">
            Ξ{" "}
            {isLoadingConsolidationFee || estimatedGasFee === null ? (
              <div className="flex items-center gap-2">
                <PectraSpinner />
                <span className="text-sm">Calculating...</span>
              </div>
            ) : (
              <div className="text-sm font-medium">
                {estimatedGasFee < parseEther("0.000001")
                  ? "< 0.000001"
                  : Number(formatEther(estimatedGasFee)).toFixed(2)}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-row justify-between">
          <div className="text-sm text-zinc-700 dark:text-zinc-300">
            Estimated completion time
          </div>
          {/*TODO: Populate with real estimate*/}
          <div className="text-sm font-medium">12-24 hours</div>
        </div>
      </div>
    </div>
  );
};
