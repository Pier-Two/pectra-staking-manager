"use client";

import type { FC } from "react";
import Image from "next/image";
import { Button } from "pec/components/ui/button";
import { ChevronDown, Moon, Sun } from "lucide-react";
import { useTheme } from "pec/hooks/useTheme";
import { ConnectWalletButton } from "pec/components/ui/wallet/ConnectWallet";

export interface ITopBar {
  numberOfValidators: number;
  type: "profile" | "wallet_connect";
}

export const TopBar: FC<ITopBar> = (props) => {
  const { numberOfValidators, type } = props;
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="sticky top-0 z-10 flex h-[8vh] w-full items-center justify-between border-b bg-[rgba(255,255,255,0.98)] px-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center space-x-3">
        <Image
          src="/logos/PectraStakingManager.svg"
          alt="Pectra Staking Manager"
          className="h-12 w-12"
          width={48}
          height={48}
        />

        <div>
          <h1 className="text-lg font-semibold dark:text-white">
            Pectra Staking
          </h1>
          <h1 className="text-lg font-semibold dark:text-white">Manager</h1>
        </div>
      </div>

      {type === "profile" && (
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="text-gray-700 hover:text-black dark:text-white dark:hover:text-gray-300">
              My Validators
            </div>

            <Button className="rounded-full border bg-gray-100 p-2 text-gray-700 hover:bg-gray-100 hover:text-black dark:border-gray-800 dark:bg-black dark:text-white dark:hover:bg-gray-900 dark:hover:text-gray-300">
              {numberOfValidators}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-gray-700 hover:text-black dark:text-white dark:hover:text-gray-300">
              Tools
            </div>
            <ChevronDown className="text-gray-700 dark:text-white" />
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4 pe-12">
        <Button
          className="rounded-lg border bg-gray-100 p-3 hover:bg-gray-200 dark:border-gray-800 dark:bg-black dark:hover:bg-gray-900"
          onClick={toggleDarkMode}
        >
          {darkMode ? (
            <Sun className="text-yellow-400" />
          ) : (
            <Moon className="text-gray-700 dark:text-white" />
          )}
        </Button>

        <ConnectWalletButton className="!h-10 !w-8" />
      </div>
    </header>
  );
};
