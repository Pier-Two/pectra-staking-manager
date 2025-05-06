"use client";

import { useRouter } from "next/navigation";
import { useWalletAddress } from "pec/hooks/useWallet";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { ConnectWalletButton } from "pec/components/ui/wallet/ConnectWallet";
import OvalBlur from "pec/components/layout/welcome/oval-blur";
import { EnterAnimation } from "./enter-animation";
import { welcomeAnimationDelays } from "pec/constants/animationDelays";
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

      <div className="z-10 flex flex-col items-center justify-center gap-4">
        {hasWalletAddress ? (
          <PrimaryButton
            className="h-10 w-[420px]"
            label={"View Validators"}
            onClick={handleEnterSite}
            disabled={false}
          />
        ) : (
          <ConnectWalletButton
            className="!w-[420px] !max-w-[90vw]"
            text="Connect your wallet to unlock the future of staking"
          />
        )}
      </div>
    </EnterAnimation>
  );
};
