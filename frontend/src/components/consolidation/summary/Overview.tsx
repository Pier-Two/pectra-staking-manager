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
import { useConsolidationStore } from "pec/hooks/use-consolidation-store";
import { useConsolidationFee } from "pec/hooks/use-consolidation";
import { formatEther, parseEther } from "viem";
import { displayedEthAmount } from "pec/lib/utils/validators/balance";

export const Overview = () => {
  const { data: consolidationFee, isLoading: isLoadingConsolidationFee } =
    useConsolidationFee();

  const { consolidationTarget, validatorsToConsolidate } =
    useConsolidationStore();

  const totalSourceValidators = validatorsToConsolidate?.length;

  const newTotalBalance =
    (consolidationTarget?.balance ?? 0n) +
    validatorsToConsolidate.reduce(
      (acc, validator) => acc + validator.balance,
      0n,
    );

  const estimatedGasFee = consolidationFee
    ? consolidationFee * BigInt(totalSourceValidators)
    : BigInt(0);

  return (
    <div className="flex min-h-[10vh] w-full flex-col justify-between gap-x-4 space-y-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black">
      <div className="flex items-end gap-x-2 text-sm text-black dark:text-white">
        <span>
          Consolidate {totalSourceValidators + 1} validator
          {totalSourceValidators <= 1 ? "" : "s"} into validator with a new
          total balance of
        </span>

        <div className="flex items-center gap-1">
          <div className="font-semibold">
            Ξ {displayedEthAmount(Number(formatEther(newTotalBalance)))}
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
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Estimated gas fee ({totalSourceValidators}x consolidations)
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
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Estimated completion time
          </div>

          <div className="text-sm font-medium">12-24 hours</div>
        </div>
      </div>
    </div>
  );
};
