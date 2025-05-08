import { ArrowUpFromDot } from "lucide-react";
import Withdrawal from "./_components/withdrawal";
import type { Metadata } from "next";
import { title } from "pec/constants/metadata";

export const metadata: Metadata = {
  title: title("Unstake"),
};

const WithdrawPage = () => {
  return (
    <div className="flex w-full flex-col gap-y-2">
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex gap-x-4 text-primary-dark dark:text-indigo-300">
            <ArrowUpFromDot className="h-8 w-8 self-center" />
            <div className="text-3xl font-medium">Unstake</div>
          </div>

          <div className="text-base">
            Unstake from your validators using your web3 wallet. You can use
            this tool to perform partial withdrawals and full exits.
          </div>
          <div className="text-base">
            One benefit of partial withdrawals is how much faster the ETH will
            land in your account, for example, if the queue is empty, it will
            take 27 hours for 2000 ETH to land back into your account.
          </div>
        </div>
        <Withdrawal />
      </div>
    </div>
  );
};

export default WithdrawPage;
