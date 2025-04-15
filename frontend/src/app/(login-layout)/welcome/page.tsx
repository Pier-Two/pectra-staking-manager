"use client";

import { useRouter } from "next/navigation";
import { Footer } from "pec/components/layout/welcome/Footer";
import { Information } from "pec/components/layout/welcome/Information";
import { PectraLink } from "pec/components/layout/welcome/PectraLink";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { ConnectWalletButton } from "pec/components/ui/wallet/ConnectWallet";
import { useWalletAddress } from "pec/hooks/useWallet";
import type { FC } from "react";
import { ChartContainer } from "pec/components/charts/ChartContainer";

const Welcome: FC = () => {
  const router = useRouter();
  const walletAddress = useWalletAddress();
  const hasWalletAddress = !!walletAddress;

  const handleEnterSite = () => {
    router.push("/validators-found");
  };

  return (
    <div className="flex h-full w-full flex-col gap-y-[72px]">
      <div className="flex flex-col gap-y-4">
        <div className="flex w-full flex-col items-center justify-center gap-y-4">
          <PectraLink />

          <p className="text-center text-[50px] font-670 leading-[54px]">
            <span>This is the Future of</span>
            <span className="md:block"> Ethereum Staking</span>
          </p>
        </div>
      </div>

      <Information />

      <div className="flex w-full flex-col items-center justify-center gap-y-4">
        {!hasWalletAddress && (
          <div className="text-center text-[14px] font-570 leading-[14px]">
            Connect your withdrawal address to access validators
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-4">
          {hasWalletAddress ? (
            <PrimaryButton
              className="h-10 w-full"
              label={"View Validators"}
              onClick={handleEnterSite}
              disabled={false}
            />
          ) : (
            // TODO: Come back and address width appropriately
            <ConnectWalletButton className="!min-w-[420px]" />
          )}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <ChartContainer />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Welcome;
