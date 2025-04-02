"use client";

import type { FC } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpFromDot } from "lucide-react";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";

export const Withdrawal: FC = () => {
  const router = useRouter();

  const handleWithdrawalNavigation = () => {
    router.push("/withdraw");
  };

  return (
    <div
      className="hover:bg-activeCard hover:border-3 group flex flex-col space-y-4 rounded-xl border border-indigo-200 bg-white p-4 pe-8 ps-8 text-gray-900 hover:cursor-pointer hover:text-white dark:border-gray-700 dark:bg-black dark:text-white"
      onClick={handleWithdrawalNavigation}
    >
      <div className="flex flex-row items-center gap-x-2 text-indigo-800 group-hover:text-green-400 dark:text-indigo-200">
        <ArrowUpFromDot size={30} />
        <div className="text-2xl font-medium">Partial Withdrawal</div>
      </div>

      <div className="flex flex-col gap-y-4 pt-8">
        <div className="text-sm">
          Submit onchain execution layer withdrawal requests against validators,
          as per Pectra EIP-7002.
        </div>

        <PrimaryButton
          className="w-auto group-hover:bg-white group-hover:text-indigo-800 dark:group-hover:bg-white dark:group-hover:text-indigo-800"
          label="Withdraw now"
          disabled={false}
          onClick={handleWithdrawalNavigation}
        />
      </div>
    </div>
  );
};
