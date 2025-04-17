"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ConnectWalletButton } from "pec/components/ui/wallet/ConnectWallet";

import DarkMode from "../dark-mode";
import { SidebarTrigger } from "../ui/sidebar";

export interface ITopBar {
  numberOfValidators: number;
  type: "profile" | "wallet_connect";
}

export const TopBar = () => {
  const router = useRouter();

  const handleWelcomeNavigation = () => {
    router.push("/welcome");
  };

  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-zinc-200 bg-white/40 p-4 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-gray-950">
      <div className="order-2 flex items-center md:order-1">
        <div
          className="flex flex-row-reverse items-center gap-x-3 hover:cursor-pointer md:flex-row"
          onClick={handleWelcomeNavigation}
        >
          <Image
            src="/logos/PectraStakingManager.svg"
            alt="Pectra Staking Manager"
            width={40}
            height={40}
          />

          <div className="flex flex-col gap-y-[3px] text-right md:text-left">
            <h1 className="font-570 text-[19.8px] leading-[18px] dark:text-white">
              Pectra Staking
            </h1>
            <h1 className="font-570 text-[19.8px] leading-[18px] dark:text-white">
              Manager
            </h1>
          </div>
        </div>
      </div>

      <div className="order-1 flex items-center gap-4 md:order-2">
        <div className="md:hidden">
          <SidebarTrigger />
        </div>

        <div className="hidden items-center space-x-4 md:flex">
          <DarkMode />
          <ConnectWalletButton className="!w-fit !min-w-[123px]" />
        </div>
      </div>
    </header>
  );
};
