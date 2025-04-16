"use client";

import { Settings } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "pec/components/ui/button";
import { ConnectWalletButton } from "pec/components/ui/wallet/ConnectWallet";
import { useTheme } from "pec/hooks/useTheme";
import { useState } from "react";

import { api } from "pec/trpc/react";
import DarkMode from "../dark-mode";
import { SidebarTrigger } from "../ui/sidebar";
import { UserModal } from "../user/UserModal";

export interface ITopBar {
  numberOfValidators: number;
  type: "profile" | "wallet_connect";
}

export const TopBar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { darkMode } = useTheme();
  const { data: user } = api.users.getUser.useQuery();

  const handleWelcomeNavigation = () => {
    router.push("/welcome");
  };

  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-zinc-200 bg-white/40 backdrop-blur-md p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
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
            <h1 className="text-[19.8px] font-570 leading-[18px] dark:text-white">
              Pectra Staking
            </h1>
            <h1 className="text-[19.8px] font-570 leading-[18px] dark:text-white">
              Manager
            </h1>
          </div>
        </div>
      </div>

      <div className="order-1 flex items-center gap-4 md:order-2">        
        <div className="md:hidden">
          <SidebarTrigger />
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {user?.success && (
            <>
              <Button
                className={`rounded-full border ${
                  darkMode
                    ? "border-gray-700 dark:bg-gray-950 dark:hover:bg-gray-900"
                    : "border-primary/30 bg-white hover:bg-primary/10"
                } p-3`}
                onClick={() => setOpen(!open)}
              >
                <Settings className="text-gray-700 dark:text-white" />
              </Button>

              <UserModal
                open={open}
                setOpen={setOpen}
                userDetails={user.data}
              />
            </>
          )}

          <DarkMode />
          <ConnectWalletButton className="!w-fit !min-w-[123px]" />
        </div>
      </div>
    </header>
  );
};
