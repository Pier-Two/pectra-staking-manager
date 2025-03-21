"use client";

import type { FC } from "react";
import { api } from "pec/trpc/react";
import { useRouter } from "next/navigation";
import { Connector } from "pec/components/validators/Connector";
import { Merge } from "lucide-react";
import ConsolidationLoading from "./loading";
import { useWalletAddress } from "pec/hooks/useWallet";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { SecondaryButton } from "pec/components/ui/custom/SecondaryButton";

const Consolidation: FC = () => {
  const router = useRouter();
  const walletAddress = useWalletAddress();
  if (!walletAddress) return <ConsolidationLoading />;

  const { data } = api.validators.getValidators.useQuery({
    address: walletAddress,
  });
  if (!data) return <ConsolidationLoading />;

  const handleConsolidationRedirect = () => {
    router.push("/consolidation");
  };

  const handleDashboardRedirect = () => {
    router.push("/dashboard");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex gap-x-4">
          <Merge className="h-10 w-10 rotate-90 text-yellow-500" />
          <div className="text-3xl">Consolidate</div>
        </div>

        <div className="w-[45vw] text-gray-700">
          Combine multiple validator balances into a single large-balance
          validator, as per Pectra EIP-7251.
        </div>
        <Connector connectedAddress={walletAddress} validators={data} />
      </div>

      <div className="flex flex-col gap-4">
        <PrimaryButton
          label="Start consolidation"
          onClick={handleConsolidationRedirect}
          disabled={false}
        />

        <SecondaryButton
          label="Back to Dashboard"
          onClick={handleDashboardRedirect}
          disabled={false}
        />
      </div>
    </div>
  );
};

export default Consolidation;
