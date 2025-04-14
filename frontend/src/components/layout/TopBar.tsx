"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "pec/components/ui/button";
import { Moon, Settings, Sun } from "lucide-react";
import { useTheme } from "pec/hooks/useTheme";
import { ConnectWalletButton } from "pec/components/ui/wallet/ConnectWallet";

import { UserContainer } from "../user/UserContainer";
import { SidebarTrigger } from "../ui/sidebar";

export const TopBar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const { darkMode, toggleDarkMode } = useTheme();

  const handleWelcomeNavigation = () => {
    router.push("/welcome");
  };

  return (
    <header className="sticky flex w-full items-center justify-between border-b bg-gray-50 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="order-2 flex items-center md:order-1">
        <div
          className="flex flex-row-reverse items-center hover:cursor-pointer md:flex-row md:space-x-3"
          onClick={handleWelcomeNavigation}
        >
          <Image
            src="/logos/PectraStakingManager.svg"
            alt="Pectra Staking Manager"
            className="ml-3 h-12 w-12 md:ml-0"
            width={48}
            height={48}
          />

          <div className="flex flex-col text-right md:text-left">
            <h1 className="text-lg font-semibold dark:text-white">
              Pectra Staking
            </h1>
            <h1 className="text-lg font-semibold dark:text-white">Manager</h1>
          </div>
        </div>
      </div>

      {/* ONLY SHOW NAV BUTTON ON MOBILE/SMALLER */}
      <div className="order-1 md:order-2">
        <div className="md:hidden">
          <SidebarTrigger />
        </div>

        <div className="flex items-center space-x-4 pe-12">
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

          <Button
            className={`rounded-full border ${
              darkMode
                ? "border-gray-700 dark:bg-black dark:hover:bg-gray-900"
                : "border-indigo-400 bg-gray-100 hover:bg-gray-200"
            } p-3`}
            onClick={toggleDarkMode}
          >
            {darkMode ? (
              <Sun className="text-white" />
            ) : (
              <Moon className="text-gray-700" />
            )}
          </Button>

          <ConnectWalletButton className="!w-[50%]" />
        </div>

        <UserContainer open={open} setOpen={setOpen} />
      </div>
    </header>
  );
};
