import type { FC } from "react";
import { Separator } from "pec/components/ui/separator";
import { AlignLeft, ArrowUpFromDot, ArrowUpRight } from "lucide-react";

export const BatchWithdrawal: FC = () => {
  return (
    <div className="hover:border-3 group flex flex-col space-y-4 rounded-xl border bg-white p-4 pe-8 ps-8 hover:cursor-pointer hover:border-black dark:border-gray-800 dark:bg-black dark:hover:border-green-400">
      <div className="flex flex-shrink-0 flex-row items-center gap-8">
        <ArrowUpFromDot className="group-hover:text-green-400" size={70} />
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between">
            <div className="text-lg font-medium">Batch Withdrawal</div>
            <ArrowUpRight className="group-hover:text-green-400" size={20} />
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            Submit onchain execution layer withdrawal requests against
            validators, as per Pectra EIP-7002.
          </div>
        </div>
      </div>

      <Separator className="bg-gray-200 dark:bg-gray-800" />

      <div className="flex items-center justify-between text-sm">
        <div>Available to withdraw</div>

        <div className="flex flex-row items-center gap-1">
          <AlignLeft className="h-4 w-4" />
          <div>XXX</div>
        </div>
      </div>
    </div>
  );
};
