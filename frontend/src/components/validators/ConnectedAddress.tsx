"use client";

import type { FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Power } from "lucide-react";
import { useActiveWallet, useDisconnect } from "thirdweb/react";

import type { IConnectedAddress } from "pec/types/validator";

export const ConnectedAddress: FC<IConnectedAddress> = (props) => {
  const { address, layoutId } = props;
  const { disconnect } = useDisconnect();
  const wallet = useActiveWallet();

  const handleWelcomeNavigation = () => {
    if (!wallet) {
      console.error("No wallet connected");
      return;
    }

    disconnect(wallet);
  };

  return (
    <motion.div
      className="flex-col-2 flex h-16 w-full items-center justify-between rounded-2xl border border-border px-4 py-3 dark:border-gray-800"
      layoutId={layoutId}
    >
      <div className="flex items-center gap-x-4">
        <Image src="/icons/Wallet.svg" alt="Wallet" width={19.5} height={18} />

        <div className="flex h-10 flex-col gap-y-3">
          <div className="text-[14px] font-570 leading-[14px] text-zinc-950 dark:text-zinc-50">
            Connected with
          </div>
          <div className="font-inter text-sm font-380 leading-[14px] text-piertwo-text">
            {address.slice(0, 7)}...{address.slice(-4)}
          </div>
        </div>
      </div>

      <div className="flex h-10 w-12 items-center justify-center rounded-full p-3 transition-colors duration-300 hover:cursor-pointer hover:bg-indigo-100 dark:hover:bg-gray-900">
        <Power
          className="h-4 w-4 text-gray-800 dark:text-white"
          onClick={handleWelcomeNavigation}
        />
      </div>
    </motion.div>
  );
};
