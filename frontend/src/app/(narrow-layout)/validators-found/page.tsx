"use client";

import type { FC } from "react";
import { api } from "pec/trpc/react";
import { useRouter } from "next/navigation";
import { Connector } from "pec/components/validators/Connector";
import ValidatorsFoundLoading from "./loading";
import { useWalletAddress } from "pec/hooks/useWallet";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { SecondaryButton } from "pec/components/ui/custom/SecondaryButton";

const ValidatorsFound: FC = () => {
  const router = useRouter();
  const walletAddress = useWalletAddress();

  const { data, isFetched } = api.validators.getValidators.useQuery(
    {
      address: walletAddress || "",
    },
    { enabled: !!walletAddress },
  );

  if (!walletAddress || !data || !isFetched) return <ValidatorsFoundLoading />;

  const handleConsolidationRedirect = () => {
    router.push("/consolidation");
  };

  const handleDashboardRedirect = () => {
    router.push("/dashboard");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="text-3xl">Validators found!</div>
        <Connector connectedAddress={walletAddress} validators={data} />
      </div>

      <div className="flex flex-col gap-4">
        <PrimaryButton
          label="Start consolidation"
          onClick={handleConsolidationRedirect}
          disabled={false}
        />

        <SecondaryButton
          label="Skip and go to Dashboard"
          onClick={handleDashboardRedirect}
          disabled={false}
        />
        
        <div className="flex justify-center text-sm">
          You can access consolidation anytime.
        </div>
      </div>
    </div>
  );
};

export default ValidatorsFound;
