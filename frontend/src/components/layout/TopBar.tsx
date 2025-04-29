"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ConnectWalletButton } from "pec/components/ui/wallet/ConnectWallet";
import { cn } from "pec/lib/utils";
import type { FC } from "react";

import { useValidators } from "pec/hooks/useValidators";
import { ValidatorStatus } from "pec/types/validator";
import DarkMode from "../dark-mode";
import { PectraSpinner } from "../ui/custom/pectraSpinner";
import { SidebarTrigger } from "../ui/sidebar";
import { Tools } from "./Tools";

export interface ITopBar {
  type?: "profile" | "wallet_connect";
}

export const TopBar: FC<ITopBar> = (props) => {
  const { type } = props;
  const router = useRouter();
  const pathname = usePathname();
  const { groupedValidators, isLoading: validatorsLoading } = useValidators();

  const handleWelcomeNavigation = () => {
    router.push("/welcome");
  };

  const handleDashboardNavigation = () => {
    router.push("/dashboard");
  };

  const handleChartsNavigation = () => {
    router.push("/charts");
  };

  const handleValidatorsNavigation = () => {
    router.push("/validators-found");
  };

  return (
    <header className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-zinc-200 bg-white/40 p-4 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-gray-950">
      <div className="order-2 mr-4 flex items-center md:order-1 md:mr-0">
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

      {type === "profile" && (
        <div className="order-3 hidden items-center gap-[clamp(1rem,2.5vw,4rem)] md:flex">
          <div
            className="flex items-center space-x-2 hover:cursor-pointer"
            onClick={handleValidatorsNavigation}
          >
            <div
              className={cn(
                "hidden font-inter transition-colors duration-200 hover:cursor-pointer hover:text-zinc-500 dark:text-zinc-50 dark:hover:text-zinc-400 lg:block",
                pathname === "/validators-found" &&
                  "text-zinc-500 dark:text-zinc-400",
              )}
            >
              My Validators
            </div>

            {validatorsLoading ? (
              <PectraSpinner />
            ) : (
              <div
                className="relative flex h-6 w-6 items-center justify-center rounded-[3px] font-inter text-black dark:text-zinc-50"
                style={{
                  background:
                    "linear-gradient(130.54deg, #00FFA7 11.34%, #5164DC 31.73%, #313C86 59.22%, rgba(113, 255, 224, 0.8) 100%)",
                }}
              >
                <div className="absolute inset-[1px] rounded-[3px] bg-white dark:bg-gray-950" />
                <p className="relative text-sm font-medium">
                  {groupedValidators[ValidatorStatus.ACTIVE]?.length ?? 0}
                </p>
              </div>
            )}
          </div>

          <Tools />

          <div
            className={cn(
              "font-inter transition-colors duration-200 hover:cursor-pointer hover:text-zinc-500 dark:text-zinc-50 dark:hover:text-zinc-400",
              pathname === "/dashboard" && "text-zinc-500 dark:text-zinc-400",
            )}
            onClick={handleDashboardNavigation}
          >
            Dashboard
          </div>
          <div
            className={cn(
              "font-inter transition-colors duration-200 hover:cursor-pointer hover:text-zinc-500 dark:text-zinc-50 dark:hover:text-zinc-400",
              pathname === "/charts" && "text-zinc-500 dark:text-zinc-400",
            )}
            onClick={handleChartsNavigation}
          >
            Charts
          </div>
        </div>
      )}

      <div className="order-1 mr-4 flex items-center gap-4 md:order-3">
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
