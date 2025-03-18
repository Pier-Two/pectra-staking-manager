import type { FC } from "react";
import type { IConsolidationOverview } from "pec/types/consolidation";
import { Separator } from "pec/components/ui/separator";
import { AlignLeft } from "lucide-react";

export const Overview: FC<IConsolidationOverview> = (props) => {
  const { destinationValidator, sourceValidators } = props;
  const totalSourceValidators = sourceValidators.length;
  const newTotalBalance =
    destinationValidator.balance +
    sourceValidators.reduce((acc, validator) => acc + validator.balance, 0);

  return (
    <div className="flex min-h-[10vh] w-full flex-col justify-between gap-x-4 space-y-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black">
      <div className="text-md text-gray-700 dark:text-gray-300 flex gap-x-1">
        Consolidate
        <span className="font-bold text-black dark:text-white">{totalSourceValidators} validators</span>
        into
        <span className="font-bold text-black dark:text-white">one</span>
        with a new total balance of
        <span className="font-bold text-black dark:text-white">{newTotalBalance.toFixed(2)}</span>
      </div>

      <Separator className="bg-gray-200 dark:bg-gray-800" />

      <div className="flex w-full flex-col space-y-2">
        <div className="flex flex-row justify-between">
          <div className="text-md text-gray-700 dark:text-gray-300">
            Estimated gas fee ({totalSourceValidators + 1}x consolidations)
          </div>

          <div className="flex items-center gap-1">
            <AlignLeft className="h-3 w-3 text-gray-500" />
            <span>XXX</span>
          </div>
        </div>

        <div className="flex flex-row justify-between">
          <div className="text-md text-gray-700 dark:text-gray-300">
            Estimated completion time
          </div>

          <div className="text-md">
            XXX-XXX hours
          </div>
        </div>
      </div>
    </div>
  );
};
