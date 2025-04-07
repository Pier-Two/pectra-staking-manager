"use client";

import type { FC } from "react";
import Image from "next/image";
import type { IConnectedAddress } from "pec/types/validator";
import { Power } from "lucide-react";
import { useRouter } from "next/navigation";

export const ConnectedAddress: FC<IConnectedAddress> = (props) => {
  const { address } = props;
  const router = useRouter();

  const handleWelcomeNavigation = () => {
    router.push(`/welcome`);
  };

  return (
    <div className="flex-col-2 flex w-full items-center justify-between rounded-xl px-4 py-2 border border-indigo-200 dark:border-gray-800">
      <div className="flex items-center gap-x-4">
        <Image src="/icons/Wallet.svg" alt="Wallet" width={24} height={24} />

        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium">Connected with</div>
          <div className="text-xs text-gray-700 dark:text-gray-300">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        </div>
      </div>

      <Power className="text-gray-800 dark:text-white h-4 w-4 hover:cursor-pointer hover:text-red-500" onClick={handleWelcomeNavigation} />
    </div>
  );
};
