"use client";

import { useRouter } from "next/navigation";

import OvalBlur from "pec/components/layout/welcome/oval-blur";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { ConnectWalletButton } from "pec/components/ui/wallet/ConnectWallet";
import { welcomeAnimationDelays } from "pec/constants/animationDelays";
import { useWalletAddress } from "pec/hooks/useWallet";

import { EnterAnimation } from "./enter-animation";

export const EnterSiteButton = () => {
  const router = useRouter();
  const walletAddress = useWalletAddress();
  const hasWalletAddress = !!walletAddress;

  const handleEnterSite = () => {
    router.push("/validators-found");
  };

  return (
    <EnterAnimation
      className="relative flex w-full flex-col items-center justify-center gap-y-4"
      delay={welcomeAnimationDelays.enterSiteButton}
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <OvalBlur />
      </div>

      {!hasWalletAddress && (
        <div className="z-10 text-center text-[14px] font-570 leading-[14px]">
          Connect your withdrawal address to access validators
        </div>
      )}

      <div className="z-10 flex flex-col items-center justify-center gap-4">
        {hasWalletAddress ? (
          <PrimaryButton
            className="h-10 w-full"
            label={"View Validators"}
            onClick={handleEnterSite}
            disabled={false}
          />
        ) : (
          <ConnectWalletButton className="!w-[420px] !max-w-[90vw]" />
        )}
      </div>
    </EnterAnimation>
  );
};
