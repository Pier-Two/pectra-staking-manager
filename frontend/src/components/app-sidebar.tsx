"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "pec/components/ui/sidebar";
import { useActiveAccount } from "thirdweb/react";
import { cardPresets } from "./dashboard/tools/ToolCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ConnectWalletButton } from "./ui/wallet/ConnectWallet";
import { useValidators } from "pec/hooks/useValidators";
import { PectraSpinner } from "./ui/custom/pectraSpinner";
import DarkMode from "./dark-mode";

const links = [
  {
    id: "validators",
    name: "Dashboard",
    href: "/dashboard",
    requireAuth: true,
  },
  {
    id: "charts",
    name: "Charts",
    href: "/charts",
    requireAuth: false,
  },
];

export function AppSidebar() {
  const account = useActiveAccount();
  const { data: validators, isLoading: validatorsLoading } = useValidators();

  // Filter links based on authentication status
  const filteredLinks = links.filter(
    (link) => !link.requireAuth || (link.requireAuth && account),
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <a
          href="/welcome"
          className="flex flex-row items-center gap-4 hover:cursor-pointer"
        >
          <Image
            src="/logos/PectraStakingManager.svg"
            alt="Pectra Staking Manager"
            className="ml-3 h-12 w-12 md:ml-0"
            width={48}
            height={48}
          />

          <div className="flex flex-col text-left">
            <h1 className="text-lg font-semibold dark:text-white">
              Pectra Staking
            </h1>
            <h1 className="text-lg font-semibold dark:text-white">Manager</h1>
          </div>
        </a>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center">
            <a
              href="/validators-found"
              className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              My Validators
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
                  <div className="absolute inset-[1px] rounded-[3px] bg-sidebar" />
                  <p className="relative text-sm font-medium text-gray-700 dark:text-gray-200">
                    {validators?.length}
                  </p>
                </div>
              )}
            </a>
          </div>
          {filteredLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              {link.name}
            </a>
          ))}

          {account && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex w-full items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                <span>Tools</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mr-4">
                {Object.entries(cardPresets).map(([key, preset]) => (
                  <DropdownMenuItem key={key} className="px-4 py-2 text-sm">
                    <a
                      href={preset.url}
                      className="w-full text-gray-700 dark:text-gray-200"
                    >
                      {preset.title}
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="w-full flex-row items-center justify-center space-x-2 pb-12">
        <DarkMode />
        <ConnectWalletButton />
      </SidebarFooter>
    </Sidebar>
  );
}
