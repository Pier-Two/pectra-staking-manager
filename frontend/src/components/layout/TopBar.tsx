"use client";

import type { FC } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "pec/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "pec/hooks/useTheme";
import { ConnectWalletButton } from "pec/components/ui/wallet/ConnectWallet";
import { Badge } from "../ui/badge";
import { Tools } from "./Tools";

export interface ITopBar {
  numberOfValidators: number;
  type: "profile" | "wallet_connect";
}

export const TopBar: FC<ITopBar> = (props) => {
  const { numberOfValidators, type } = props;
  const { darkMode, toggleDarkMode } = useTheme();
  const router = useRouter();

  const handleDashboardNavigation = () => {
    router.push("/dashboard");
  };

  const handleChartsNavigation = () => {
    router.push("/charts");
  };

  return (
    <header className="sticky top-0 z-10 flex min-h-[10vh] w-full items-center justify-between border-b bg-white px-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div
        className="flex items-center space-x-3 hover:cursor-pointer"
        onClick={handleDashboardNavigation}
      >
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
            <div className="text-gray-700 dark:text-gray-300">
              My Validators
            </div>

            <Badge
              variant="outline"
              className="rounded-lg bg-gradient-to-r from-[#00FFA7] via-[#5164DC] to-[#313C86] px-1 text-white"
            >
              {numberOfValidators}
            </Badge>
          </div>

          <Tools />

          <div
            className="text-gray-700 hover:cursor-pointer hover:font-medium hover:text-black dark:text-gray-300 dark:hover:text-white"
            onClick={handleChartsNavigation}
          >
            Charts
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4 pe-12">
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
    </header>
  );
};
