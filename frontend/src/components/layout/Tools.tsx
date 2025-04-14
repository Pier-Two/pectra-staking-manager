"use client";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "pec/components/ui/dropdown-menu";
import {
  ArrowDownToDot,
  ArrowUpFromDot,
  ChevronDown,
  Merge,
} from "lucide-react";

export const Tools = () => {
  const router = useRouter();

  const handleConsolidateNavigation = () => {
    router.push("/consolidate");
  };

  const handleBatchDepositNavigation = () => {
    router.push("/batch-deposit");
  };

  const handleBatchWithdrawalNavigation = () => {
    router.push("/withdraw");
  };

  return (
    <div className="items-center hover:cursor-pointer hover:font-medium">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-1">
            <div className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white">
              Tools
            </div>
            <ChevronDown className="text-gray-700 dark:text-white" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="border:indigo-200 rounded-xl bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-black">
          <div className="flex flex-col gap-6">
            <DropdownMenuItem>
              <div
                className="flex items-center gap-8 text-gray-500 hover:cursor-pointer hover:text-black dark:text-gray-400 dark:hover:text-white"
                onClick={handleConsolidateNavigation}
              >
                <Merge className="rotate-90 scale-150 text-yellow-500" />
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row justify-between">
                    <div className="text-lg font-medium text-black dark:text-white">
                      Consolidate
                    </div>
                  </div>

                  <div className="text-xs">
                    Combine multiple Pectra validators (0x02 credentials) into
                    one large-balance validator.
                  </div>
                </div>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <div
                className="flex items-center gap-8 text-gray-500 hover:cursor-pointer hover:text-black dark:text-gray-400 dark:hover:text-white"
                onClick={handleBatchDepositNavigation}
              >
                <ArrowDownToDot className="scale-150 text-blue-400" />
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row justify-between">
                    <div className="text-lg font-medium text-black dark:text-white">
                      Deposit
                    </div>
                  </div>

                  <div className="text-xs">
                    Deposit to multiple active validators at once, via
                    PierTwo&apos;s batch deposit contract.
                  </div>
                </div>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <div
                className="flex items-center gap-8 text-gray-500 hover:cursor-pointer hover:text-black dark:text-gray-400 dark:hover:text-white"
                onClick={handleBatchWithdrawalNavigation}
              >
                <ArrowUpFromDot className="scale-150 text-green-400" />
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row justify-between">
                    <div className="text-lg font-medium text-black dark:text-white">
                      Withdraw
                    </div>
                  </div>

                  <div className="text-xs">
                    Submit onchain execution layer withdrawal requests against
                    validators, as per Pectra EIP-7002.
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
