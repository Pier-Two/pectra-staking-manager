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
    <div className="hover:border-3 group flex flex-col space-y-4 rounded-xl border border-indigo-200 bg-white p-4 pe-8 ps-8 text-white hover:cursor-pointer dark:border-gray-700 dark:bg-black">
      <div className="flex flex-row items-center gap-x-2 text-indigo-800 dark:text-indigo-200">
        <ArrowDownToDot size={30} />
        <div className="text-2xl font-medium">Batch Deposit</div>
      </div>

      <div className="flex flex-col gap-y-4 pt-8">
        <div className="text-gray-900 dark:text-white">
          Deposit multiple active validators at once, via PierTwo&apos;s batch
          deposit contract.
        </div>

        <PrimaryButton
          className="w-[40%]"
          label="Deposit now"
          disabled={false}
          onClick={handleBatchDepositRedirect}
        />
      </div>
    </div>
  );
};
