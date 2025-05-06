"use client";

import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { SecondaryButton } from "pec/components/ui/custom/SecondaryButton";
import { Connector } from "pec/components/validators/Connector";
import { useWalletAddress } from "pec/hooks/useWallet";
import { EIconPosition } from "pec/types/components";
import { useValidators } from "pec/hooks/useValidators";
import { EnterAnimation } from "pec/app/(login-layout)/welcome/_components/enter-animation";
import ValidatorsFoundLoading from "./validators-found-loading";
import { useEffect } from "react";
import { trackEvent } from "pec/helpers/trackEvent";

const ValidatorsFound = () => {
  const walletAddress = useWalletAddress();

  const { data, isSuccess } = useValidators();

  useEffect(() => {
    if (data && isSuccess) {
      trackEvent("validators_found", {
        validators: data.length,
      });
    }
  }, [data, isSuccess]);

  if (!walletAddress || !data || !isSuccess) return <ValidatorsFoundLoading />;

  return (
    <div className="flex w-full flex-col gap-6">
      <Connector
        title={data.length > 0 ? "Validators Found!" : "No Validators Found"}
        connectedAddress={walletAddress}
        className="!text-center"
        titleClassName="!text-center"
        validators={data}
      />

      <EnterAnimation>
        <div className="flex flex-col gap-4 !pt-6">
          <Link href="/consolidation" className="flex w-full justify-center">
            <PrimaryButton
              label="Start consolidation"
              disabled={false}
              className="w-full"
              onClick={() => {
                trackEvent("validators_found_start_consolidation");
              }}
            />
          </Link>

          <Link href="/dashboard" className="flex w-full justify-center">
            <SecondaryButton
              label="Skip and go to Dashboard"
              icon={<ArrowRightIcon />}
              iconPosition={EIconPosition.RIGHT}
              disabled={false}
              className="w-full"
              onClick={() => {
                trackEvent("validators_found_skip_consolidation");
              }}
            />
          </Link>
          <p className="flex justify-center text-[13px] leading-[13px]">
            You can access consolidation anytime.
          </p>
        </div>
      </EnterAnimation>
    </div>
  );
};

export default ValidatorsFound;
