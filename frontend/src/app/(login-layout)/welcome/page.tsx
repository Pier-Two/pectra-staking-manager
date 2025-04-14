"use client";

import { useRouter } from "next/navigation";
import { Footer } from "pec/components/layout/welcome/Footer";
import { Information } from "pec/components/layout/welcome/Information";
import { PectraLink } from "pec/components/layout/welcome/PectraLink";
import { ConnectWalletButton } from "pec/components/ui/wallet/ConnectWallet";
import type { FC } from "react";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { useWalletAddress } from "pec/hooks/useWallet";

const Welcome: FC = () => {
  const router = useRouter();
  const walletAddress = useWalletAddress();
  const hasWalletAddress = !!walletAddress;

  const handleEnterSite = () => {
    router.push("/validators-found");
  };

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex w-full flex-col items-center justify-center gap-1">
        <PectraLink />

        <p className="text-center text-5xl">
          <span>This is the Future</span>
          <span className="md:block"> of Ethereum Staking</span>
        </p>
      </div>

      <Information />

      <div className="mt-12 flex w-full flex-col items-center justify-center gap-2">
        {!hasWalletAddress && (
          <div className="text-center text-xs">
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
            <ConnectWalletButton className="w-full text-xs" />
          )}
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <Footer />
      </div>
    </div>
  );
};

export default Welcome;
