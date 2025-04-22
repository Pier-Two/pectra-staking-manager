"use client";

import { useRouter } from "next/navigation";
import { useWalletAddress } from "pec/hooks/useWallet";
import { PrimaryButton } from "pec/components/ui/custom/PrimaryButton";
import { ConnectWalletButton } from "pec/components/ui/wallet/ConnectWallet";

export const EnterSiteButton = () => {
  const router = useRouter();
  const walletAddress = useWalletAddress();
  const hasWalletAddress = !!walletAddress;

  const handleEnterSite = () => {
    router.push("/validators-found");
  };

  return (
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
          <ConnectWalletButton className="!w-[420px] !max-w-[90vw]" />
        )}
      </div>
    </div>
  );
};
