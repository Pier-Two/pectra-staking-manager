"use client";

import { Power } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { IConnectedAddress } from "pec/types/validator";
import type { FC } from "react";

export const ConnectedAddress: FC<IConnectedAddress> = (props) => {
  const { address } = props;
  const router = useRouter();

  const handleWelcomeNavigation = () => {
    router.push(`/welcome`);
  };

  return (
    <div className="flex-col-2 flex h-16 w-full items-center justify-between rounded-xl border border-border px-4 py-3 dark:border-gray-800">
      <div className="flex items-center gap-x-4">
        <Image src="/icons/Wallet.svg" alt="Wallet" width={19.5} height={18} />

        <div className="flex h-10 flex-col gap-y-3">
          <div className="font-570 text-[14px] leading-[14px] text-zinc-950">
            Connected with
          </div>
          <div className="font-380 text-[14px] leading-[14px] text-[#4C4C4C] dark:text-gray-300">
            {address.slice(0, 7)}...{address.slice(-4)}
          </div>
        </div>
      </div>

      <Power
        className="h-4 w-4 text-gray-800 hover:cursor-pointer hover:text-red-500 dark:text-white"
        onClick={handleWelcomeNavigation}
      />
    </div>
  );
};
