"use client";

import { useWalletAddress } from "pec/hooks/useWallet";
import { ConnectedAddress } from "pec/components/validators/ConnectedAddress";
import { PectraSpinner } from "pec/components/ui/custom/pectraSpinner";

const ValidatorsFoundLoading = () => {
  const walletAddress = useWalletAddress();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex w-[35vw] flex-col items-center gap-4">
        <div className="text-2xl font-medium">Searching for validators</div>
        <div className="text-sm">
          Matching your connected withdrawal address
        </div>
        <ConnectedAddress address={walletAddress} />

        <div className="flex-col-2 flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black">
          <div className="flex items-center gap-x-4">
            <PectraSpinner />
            <div className="flex flex-col">
              <div className="text-sm">
                Finding validators with this withdrawal address
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm flex justify-center">Please wait...</div>
      </div>
    </div>
  );
};

export default ValidatorsFoundLoading;
