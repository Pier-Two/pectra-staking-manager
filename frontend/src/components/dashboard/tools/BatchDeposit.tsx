"use client";

import type { FC } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownToDot } from "lucide-react";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";

export const BatchDeposit: FC = () => {
  const router = useRouter();

  const handleBatchDepositRedirect = () => {
    router.push("/batch-deposit");
  };

  return (
    <div
      className="hover:bg-activeCard hover:border-3 group flex flex-col space-y-4 rounded-xl border border-indigo-200 bg-white p-4 pe-8 ps-8 text-gray-900 hover:cursor-pointer hover:text-white dark:border-gray-700 dark:bg-black dark:text-white"
      onClick={handleBatchDepositRedirect}
    >
      <div className="flex flex-row items-center gap-x-2 text-indigo-800 group-hover:text-blue-200 dark:text-indigo-200">
        <ArrowDownToDot size={30} />
        <div className="text-2xl font-medium">Batch Deposit</div>
      </div>

      <div className="flex flex-col gap-y-4 pt-8">
        <div>
          Deposit multiple active validators at once, via PierTwo&apos;s batch
          deposit contract.
        </div>

        <PrimaryButton
          className="w-auto group-hover:bg-white group-hover:text-indigo-800"
          label="Deposit now"
          disabled={false}
          onClick={handleBatchDepositRedirect}
        />
      </div>
    </div>
  );
};
