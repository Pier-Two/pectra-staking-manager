"use client";

import type { FC } from "react";
import { api } from "pec/trpc/react";
import Link from "next/link";
import { Connector } from "pec/components/validators/Connector";
import ValidatorsFoundLoading from "./loading";
import { useWalletAddress } from "pec/hooks/useWallet";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { SecondaryButton } from "pec/components/ui/custom/SecondaryButton";
import { ArrowRightIcon } from "lucide-react";
import { EIconPosition } from "pec/types/components";

const ValidatorsFound: FC = () => {
  const walletAddress = useWalletAddress();

  const { data, isFetched } = api.validators.getValidators.useQuery(
    {
      address: walletAddress || "",
    },
    { enabled: !!walletAddress },
  );

  if (!walletAddress || !data || !isFetched) return <ValidatorsFoundLoading />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <div className="text-center text-2xl font-medium">
          Validators found!
        </div>
        <Connector
          connectedAddress={walletAddress}
          textAlignment="center"
          validators={data}
        />
      </div>

      <div className="flex w-full flex-col justify-center gap-4">
        <Link href="/consolidation" className="flex w-full justify-center">
          <PrimaryButton label="Start consolidation" disabled={false} />
        </Link>

        <Link href="/dashboard" className="flex w-full justify-center">
          <SecondaryButton
            label="Skip and go to Dashboard"
            icon={<ArrowRightIcon />}
            iconPosition={EIconPosition.RIGHT}
            disabled={false}
          />
        </Link>

        <div className="flex justify-center text-xs">
          You can access consolidation anytime.
        </div>
      </div>
    </div>
  );
};

export default ValidatorsFound;
