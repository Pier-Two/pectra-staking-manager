import type { Metadata } from "next";
import { ArrowUpFromDot } from "lucide-react";

import { title } from "pec/constants/metadata";

import Withdrawal from "./_components/withdrawal";

export const metadata: Metadata = {
  title: title("Withdraw"),
};

const WithdrawPage = () => {
  return (
    <div className="flex w-full flex-col gap-y-2">
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex gap-x-4 text-primary-dark dark:text-indigo-300">
            <ArrowUpFromDot className="h-8 w-8 self-center" />
            <div className="text-3xl font-medium">Withdrawal</div>
          </div>

          <div className="text-base">
            Submit onchain execution layer withdrawal requests against
            validators, as per Pectra EIP-7002.
          </div>
        </div>
        <Withdrawal />
      </div>
    </div>
  );
};

export default WithdrawPage;
