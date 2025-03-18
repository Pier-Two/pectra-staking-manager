"use client";

import type { FC } from "react";
import { api } from "pec/trpc/react";
import { useRouter } from "next/navigation";
import { Connector } from "pec/components/validators/Connector";
import { Button } from "pec/components/ui/button";
import { Merge } from "lucide-react";
import ConsolidationLoading from "./loading";
import { useWalletAddress } from "pec/hooks/useWallet";

const Consolidation: FC = () => {
  const router = useRouter();
  const walletAddress = useWalletAddress();
  if (!walletAddress) return <ConsolidationLoading />;

  const { data } = api.validators.getValidators.useQuery({ address: walletAddress });
  if (!data) return <ConsolidationLoading />;

  const handleConsolidationRedirect = () => {
    router.push("/consolidation");
  };

  const handleDashboardRedirect = () => {
    router.push("/dashboard");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-x-4">
          <Merge className="h-10 w-10 rotate-90 text-yellow-500" />
          <div className="text-3xl">Consolidate</div>
        </div>
        <div className="w-[45vw] text-center text-gray-700">
          Combine multiple validator balances into a single large-balance
          validator, as per Pectra EIP-7251.
        </div>
        <Connector connectedAddress={walletAddress} validators={data} />
      </div>

      <div className="flex flex-col gap-4">
        <Button
          className="space-x-2 rounded-xl border border-gray-800 bg-black p-4 hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-200"
          onClick={handleConsolidationRedirect}
        >
          <div className="text-sm text-white dark:text-black">
            Start consolidation
          </div>
        </Button>

        <Button
          className="space-x-2 rounded-xl border border-gray-800 bg-white p-4 hover:bg-gray-200"
          onClick={handleDashboardRedirect}
        >
          <div className="text-sm text-black">Back to Dashboard</div>
        </Button>
      </div>
    </div>
  );
};

export default Consolidation;
