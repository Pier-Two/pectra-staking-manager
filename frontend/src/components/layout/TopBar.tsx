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
import { SidebarTrigger } from "../ui/sidebar";

export interface ITopBar {
  numberOfValidators: number;
  type: "profile" | "wallet_connect";
}

export const TopBar: FC<ITopBar> = (props) => {
  const { numberOfValidators, type } = props;
  const { darkMode, toggleDarkMode } = useTheme();
  const router = useRouter();

  const handleWelcomeNavigation = () => {
    router.push("/welcome");
  };

  const handleDashboardNavigation = () => {
    router.push("/dashboard");
  };

  const handleChartsNavigation = () => {
    router.push("/charts");
  };

  return (
    <header className="sticky top-0 z-10 flex w-full items-center justify-between border-b bg-gray-50 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
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

      <div className="order-1 md:order-2">
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
      </div>
    </header>
  );
};
