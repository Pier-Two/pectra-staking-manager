import { DepositWorkflowWrapper } from "./_components/deposit-workflow";
import { title } from "pec/constants/metadata";
import type { Metadata } from "next";
import { ArrowDownToDot } from "lucide-react";

export const metadata: Metadata = {
  title: title("Batch Deposit"),
};

const BatchDeposit = () => (
  <div className="flex w-full flex-col gap-y-4">
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex gap-x-4 text-primary-dark dark:text-indigo-300">
          <ArrowDownToDot className="h-8 w-8 self-center" />
          <div className="text-3xl font-medium">Deposit</div>
        </div>

        <div className="text-base">
          Top up your existing validators in one transaction. Send any amount of
          ETH, up to a total of 2016, to validators that are connected to your
          withdrawal address.
        </div>
        <div className="text-base">
          In order to see the full benefits of Pectra’s auto-compounding, it is
          recommended to top up validators to slightly less than the 2048 amount
          (e.g. 2000).
        </div>
      </div>
      <DepositWorkflowWrapper />
    </div>
  </div>
);

export default BatchDeposit;
