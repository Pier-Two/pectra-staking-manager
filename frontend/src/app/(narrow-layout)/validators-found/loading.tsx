"use client";

import { useWalletAddress } from "pec/hooks/useWallet";
import { ConnectedAddress } from "pec/components/validators/ConnectedAddress";
import { LoaderCircle } from "lucide-react";

const ValidatorsFoundLoading = () => {
  const walletAddress = useWalletAddress();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex w-[50vw] flex-col items-center gap-4">
        <div className="text-3xl">Searching for validators</div>
        <div className="text-md">
          Matching your connected withdrawal address
        </div>
        <ConnectedAddress address={walletAddress} />

        <div className="flex-col-2 flex min-h-[10vh] w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black">
          <div className="flex items-center gap-x-4">
            <LoaderCircle className="h-5 w-5 animate-spin text-gray-800 dark:text-white" />

            <div className="flex flex-col">
              <div className="text-md">
                Finding validators with this withdrawal address
              </div>
            </div>
          </div>
        </div>

        <div className="text-md flex justify-center">Please wait...</div>
      </div>
    </div>
  );
};

export default ValidatorsFoundLoading;
