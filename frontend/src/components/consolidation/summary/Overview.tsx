"use client";

import type { FC } from "react";
import type { IConsolidationOverview } from "pec/types/consolidation";
import { Separator } from "pec/components/ui/separator";
import { AlignLeft, Info, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "pec/components/ui/tooltip";
import { DECIMAL_PLACES } from "pec/lib/constants";
import { useConsolidation } from "pec/hooks/useConsolidation";
import { PectraSpinner } from "pec/components/ui/custom/pectraSpinner";

export const Overview: FC<IConsolidationOverview> = (props) => {
  const { destinationValidator, sourceValidators } = props;
  const { consolidationFee } = useConsolidation();

  const totalSourceValidators = sourceValidators.length;
  const newTotalBalance =
    destinationValidator.balance +
    sourceValidators.reduce((acc, validator) => acc + validator.balance, 0);
  const estimatedGasFee = consolidationFee
    ? consolidationFee * totalSourceValidators
    : null;

  return (
    <div className="flex min-h-[10vh] w-full flex-col justify-between gap-x-4 space-y-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black">
      <div className="flex gap-x-2 text-sm text-black dark:text-white">
        <span>
          Consolidate {totalSourceValidators} validators into one validator with
          a new total balance of
        </span>

        <div className="flex items-center gap-1">
          <AlignLeft className="h-3 w-3 text-gray-500 dark:text-white" />
          <span>{newTotalBalance.toFixed(DECIMAL_PLACES)}</span>
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
            Estimated gas fee ({totalSourceValidators + 1}x consolidations)
          </div>

          <div className="flex items-center gap-1">
            <AlignLeft className="h-3 w-3" />
            {consolidationFee === null ? (
              <div className="flex items-center gap-2">
                <PectraSpinner />
                <span className="text-sm">Calculating...</span>
              </div>
            ) : (
              <div className="text-sm font-medium">
                {estimatedGasFee?.toFixed(DECIMAL_PLACES) ?? "0"}
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
