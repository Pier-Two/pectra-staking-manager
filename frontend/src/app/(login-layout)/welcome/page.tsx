"use client";

import type { FC } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "pec/components/layout/welcome/Footer";
import { Information } from "pec/components/layout/welcome/Information";
import { PectraLink } from "pec/components/layout/welcome/PectraLink";
import { ConnectWalletButton } from "pec/components/ui/wallet/ConnectWallet";
// import { ChartLink } from "pec/components/layout/welcome/ChartLink";
import { useWalletAddress } from "pec/hooks/useWallet";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";

const Welcome: FC = () => {
  const router = useRouter();
  const walletAddress = useWalletAddress();
  const hasWalletAddress = !!walletAddress;

  const handleEnterSite = () => {
    router.push("/validators-found");
  };

  return (
    <div className="mt-[8%] flex h-full flex-col gap-16">
      <div className="flex flex-col items-center justify-center gap-1">
        <PectraLink />
        <div className="text-5xl font-semibold mt-5">This is the Future of</div>
        <div className="text-5xl font-semibold">Ethereum Staking</div>
      </div>

      <div className="flex justify-center text-sm">
        <Information />
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <div className="text-center text-sm">
          Connect your withdrawal address to access validators
        </div>

        <div className="flex w-[25vw] flex-col items-center justify-center gap-4">
          {hasWalletAddress ? (
            <PrimaryButton
              className="w-full h-10"
              label={"Enter site"}
              onClick={handleEnterSite}
              disabled={false}
            />
          ) : (
            <ConnectWalletButton />
          )}
          {/* <ChartLink numberOfUpgrades={123456} upgradePercentage={15} /> */}
        </div>
      </div>

      <div className="flex justify-center">
        <Footer />
      </div>
    </div>
  );
};

export default Welcome;
