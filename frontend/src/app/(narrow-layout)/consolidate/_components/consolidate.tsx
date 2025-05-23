"use client";

import { Merge } from "lucide-react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { SecondaryButton } from "pec/components/ui/custom/SecondaryButton";
import { Connector } from "pec/components/validators/Connector";
import { useValidators } from "pec/hooks/useValidators";
import { useWalletAddress } from "pec/hooks/useWallet";
import { ConsolidateLoading } from "./consolidate-loading";

export const Consolidate = () => {
  const router = useRouter();
  const walletAddress = useWalletAddress();
  const { data } = useValidators();

  if (!data) return <ConsolidateLoading />;

  const handleConsolidationRedirect = () => {
    router.push("/consolidation");
  };

  const handleDashboardRedirect = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <Connector
        description={
          <div className="flex flex-col gap-2">
            <p className="w-full text-base">
              Multiple validator balances can be combined into a single 0x02
              Pectra validator up to a maximum of 2048 ETH.
            </p>
            <p className="w-full text-base">
              Consensus-layer rewards will auto-compound into that validator
              until it reaches the 2048 ETH limit, after which any additional
              rewards are automatically returned to your withdrawal address.
            </p>
          </div>
        }
        connectedAddress={walletAddress}
        validators={data}
        title={
          <div className="flex gap-x-4">
            <Merge className="h-10 w-10 rotate-90 text-yellow-500" />
            <div className="text-3xl">Consolidate</div>
          </div>
        }
      />

      <div className="flex flex-col gap-4 !pt-6">
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
