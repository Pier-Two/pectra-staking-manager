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
import { ConnectWalletButton } from "./ui/wallet/ConnectWallet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cardPresets } from "./dashboard/tools/ToolCard";

const links = [
  {
    id: "home",
    name: "Home",
    href: "/welcome",
    requireAuth: false,
  },
  {
    id: "validators",
    name: "My Validators",
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

  // Filter links based on authentication status
  const filteredLinks = links.filter(
    (link) => !link.requireAuth || (link.requireAuth && account),
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-row items-center gap-4">
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
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
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
      <SidebarFooter className="flex w-full items-center justify-center pb-12">
        <ConnectWalletButton />
      </SidebarFooter>
    </Sidebar>
  );
}
