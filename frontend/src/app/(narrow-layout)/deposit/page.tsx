import { DepositWorkflowWrapper } from "./_components/deposit-workflow";
import { title } from "pec/constants/metadata";
import type { Metadata } from "next";
import { ArrowDownToDot } from "lucide-react";
import { BatchContractLink } from "./_components/batch-contract-link";

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
          Top up your existing validators in one transaction using{" "}
          <BatchContractLink />, adding enough ETH to bring each balance between
          32 ETH and 2048 ETH.
        </div>
        <div className="text-base">
          Consensus layer rewards then auto‐compound into each validator until
          it reaches 2048 ETH; any excess rewards are sent to your withdrawal
          address automatically by the Ethereum network.
        </div>
      </div>
      <DepositWorkflowWrapper />
    </div>
  </div>
);

export default BatchDeposit;
