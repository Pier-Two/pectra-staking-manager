import type { FC } from "react";
import { AlignLeft, Equal, Plus, Zap } from "lucide-react";
import type { IDestinationValidatorDetails } from "pec/types/consolidation";
import { Separator } from "pec/components/ui/separator";

export const DestinationValidatorDetails: FC<IDestinationValidatorDetails> = (
  props,
) => {
  const { consolidatedTotal, validator, selectedSourceTotal } = props;

  return (
    <>
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
        <div className="flex flex-row items-center gap-2 rounded-t-xl bg-black p-4 text-white">
          <Zap fill="white" className="h-4 w-4" />
          <div>Validators on Pectra can now support balances up to 2,048</div>
        </div>

        <div className="flex flex-row justify-between pe-4 ps-4">
          <div className="text-md text-gray-700 dark:text-gray-300">
            Current destination balance
          </div>

          <div className="flex items-center gap-1">
            <AlignLeft className="h-3 w-3 text-gray-500" />
            <span>{validator.balance.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-row justify-between pe-4 ps-4">
          <div className="flex flex-row items-center gap-2">
            <Plus className="h-4 w-4" />

            <div className="text-md text-gray-700 dark:text-gray-300">
              Selected source total
            </div>
          </div>

          <div className="flex items-center gap-1">
            <AlignLeft className="h-3 w-3 text-gray-500" />
            <span>{selectedSourceTotal.toFixed(2)}</span>
          </div>
        </div>

        <Separator className="bg-gray-200 dark:bg-gray-800" />

        <div className="flex flex-row justify-between pb-4 pe-4 ps-4">
          <div className="flex flex-row items-center gap-2">
            <Equal className="h-4 w-4" />

            <div className="text-md text-gray-700 dark:text-gray-300">
              Consolidated total
            </div>
          </div>

          <div className="flex items-center gap-1">
            <AlignLeft className="h-3 w-3 text-gray-500" />
            <span>{consolidatedTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </>
  );
};
