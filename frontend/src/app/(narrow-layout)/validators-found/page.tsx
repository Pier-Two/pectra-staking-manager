"use client";

import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { Button } from "pec/components/ui/button";
import { SecondaryButton } from "pec/components/ui/custom/SecondaryButton";
import { Connector } from "pec/components/validators/Connector";
import { useWalletAddress } from "pec/hooks/useWallet";
import { api } from "pec/trpc/react";
import { EIconPosition } from "pec/types/components";
import type { FC } from "react";
import ValidatorsFoundLoading from "./loading";

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
    <div className="flex flex-col gap-y-9">
      <Connector
        title="Validators found!"
        connectedAddress={walletAddress}
        textAlignment="center"
        validators={data}
      />

      <div className="flex flex-col gap-y-3">
        <div className="flex w-full flex-col justify-center gap-y-4">
          <Link href="/consolidation" className="flex w-full justify-center">
            <PrimaryButton
              label="Start consolidation"
              disabled={false}
              className="w-full"
            />
          </Link>

          <Link href="/dashboard" className="flex w-full justify-center">
            <SecondaryButton
              label="Skip and go to Dashboard"
              icon={<ArrowRightIcon />}
              iconPosition={EIconPosition.RIGHT}
              disabled={false}
              className="w-full"
            />
          </Link>
        </div>

      <div className="flex w-full flex-col justify-center gap-4">
        <Button asChild className="w-full">
          <Link href="/consolidation">Start Consolidation</Link>
        </Button>

        <Link href="/dashboard" className="flex w-full justify-center">
          <SecondaryButton
            label="Skip and go to Dashboard"
            icon={<ArrowRightIcon />}
            iconPosition={EIconPosition.RIGHT}
            disabled={false}
          />
        </Link>

        <p className="flex justify-center text-[13px] leading-[13px]">
          You can access consolidation anytime.
        </p>
      </div>
    </div>
  );
};

export default ValidatorsFound;
