"use client";

import { PectraSpinner } from "pec/components/ui/custom/pectraSpinner";
import { ConnectedAddress } from "pec/components/validators/ConnectedAddress";
import { useWalletAddress } from "pec/hooks/useWallet";

const ValidatorsFoundLoading = () => {
  const walletAddress = useWalletAddress();

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-[80vw] flex-col items-center gap-4 md:w-[55vw]">
        <div className="text-2xl font-medium">Searching for validators</div>
        <div className="text-sm">
          Matching your connected withdrawal address
        </div>
        <ConnectedAddress address={walletAddress} />

        <div className="flex-col-2 flex w-full items-center justify-between rounded-2xl bg-white p-4 dark:border-gray-800 dark:bg-black">
          <div className="flex items-center gap-x-4">
            <PectraSpinner />
            <div className="flex flex-col">
              <div className="text-sm font-570">Finding your validators...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidatorsFoundLoading;
