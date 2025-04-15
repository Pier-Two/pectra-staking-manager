"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "pec/components/ui/button";
import { Settings } from "lucide-react";
import { useTheme } from "pec/hooks/useTheme";
import { ConnectWalletButton } from "pec/components/ui/wallet/ConnectWallet";

import { SidebarTrigger } from "../ui/sidebar";
import DarkMode from "../dark-mode";
import { api } from "pec/trpc/react";
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
    <header className="sticky flex w-full items-center justify-between border-b border-zinc-200 bg-white/40 p-4 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-gray-950">
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

      {/* ONLY SHOW NAV BUTTON ON MOBILE/SMALLER */}
      <div className="order-1 md:order-2">
        <div className="md:hidden">
          <SidebarTrigger />
        </div>

        <div className="flex items-center space-x-4 pe-12">
          <ConnectWalletButton className="!w-fit !min-w-[123px]" />
          {user?.success && (
            <>
              <Button
                className={`rounded-full border ${
                  darkMode
                    ? "border-gray-700 dark:bg-black dark:hover:bg-gray-900"
                    : "border-indigo-400 bg-gray-100 hover:bg-gray-200"
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
        </div>
      </div>
    </header>
  );
};
