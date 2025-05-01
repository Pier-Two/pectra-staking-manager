import type { Metadata } from "next";
import { ArrowDownToDot } from "lucide-react";

import { title } from "pec/constants/metadata";

import { DepositWorkflowWrapper } from "./_components/deposit-workflow";

export const metadata: Metadata = {
  title: title("Batch Deposit"),
};

const BatchDeposit = () => (
  <div className="flex w-full flex-col gap-y-4">
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex gap-x-4 text-primary-dark dark:text-indigo-300">
          <ArrowDownToDot className="h-8 w-8 self-center" />
          <div className="text-3xl font-medium">Batch Deposit</div>
        </div>

        <div className="text-base">
          Top up your existing validators in one transaction.
        </div>
      </div>
      <DepositWorkflowWrapper />
    </div>
  </div>
);

export default BatchDeposit;
