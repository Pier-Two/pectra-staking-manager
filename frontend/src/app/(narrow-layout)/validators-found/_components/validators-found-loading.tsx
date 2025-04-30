"use client";

import { motion } from "motion/react";
import { PectraSpinner } from "pec/components/ui/custom/pectraSpinner";
import { ConnectedAddress } from "pec/components/validators/ConnectedAddress";
import { useWalletAddress } from "pec/hooks/useWallet";

const ValidatorsFoundLoading = () => {
  const walletAddress = useWalletAddress();

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex w-full flex-col items-center gap-3">
        <div className="text-2xl font-570 leading-relaxed">
          Searching for validators
        </div>
        <div className="text-left text-base">
          Matching your connected withdrawal address
        </div>

        <ConnectedAddress
          address={walletAddress}
          layoutId={"validators-found-connected-address"}
        />
      </div>

      <motion.div
        className="flex-col-2 flex w-full items-center justify-between rounded-2xl bg-white p-4 dark:border-gray-800 dark:bg-black"
        layoutId={"validators-found-detected-validators"}
      >
        <div className="flex items-center gap-x-4">
          <PectraSpinner />
          <div className="flex flex-col">
            <div className="text-sm font-570">Finding your validators...</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ValidatorsFoundLoading;
