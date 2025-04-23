"use client";

import { Merge } from "lucide-react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { SecondaryButton } from "pec/components/ui/custom/SecondaryButton";
import { Connector } from "pec/components/validators/Connector";
import { useValidators } from "pec/hooks/useValidators";
import { useWalletAddress } from "pec/hooks/useWallet";
import type { FC } from "react";
import ConsolidationLoading from "./loading";

const Consolidation: FC = () => {
  const router = useRouter();
  const walletAddress = useWalletAddress();
  const { data } = useValidators();

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
        <div className="flex gap-x-4 justify-left">
          <Merge className="h-10 w-10 rotate-90 text-yellow-500" />
          <div className="text-3xl">Consolidate</div>
        </div>

        <Connector
          description="Combine multiple validator balances into a single large-balance
          validator, as per Pectra EIP-7251."
          connectedAddress={walletAddress}
          textAlignment="left"
          validators={data}
        />
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
