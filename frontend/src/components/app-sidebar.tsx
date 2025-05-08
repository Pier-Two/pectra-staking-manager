"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "pec/components/ui/sidebar";
import { useActiveWalletConnectionStatus } from "thirdweb/react";
import DarkMode from "./dark-mode";
import { cardPresets } from "./dashboard/tools/ToolCard";
import { ValidatorCount } from "./ui/custom/ValidatorCount";
import { ConnectWalletButton } from "./ui/wallet/ConnectWallet";
import Link from "next/link";
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { useRouter } from "next/navigation";

export function AppSidebar() {
  const connectionStatus = useActiveWalletConnectionStatus();
  const { setOpenMobile } = useSidebar();
  const router = useRouter();

  const handleNavigationClick = (path: string) => {
    setOpenMobile(false);
    router.push(path);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          href="/"
          className="flex flex-row items-center gap-4 hover:cursor-pointer"
          onClick={() => handleNavigationClick("/")}
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
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {connectionStatus === "connected" && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleNavigationClick("/dashboard")}
                  >
                    My Validators
                    <ValidatorCount />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {connectionStatus !== "connected" && (
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => handleNavigationClick("/")}>
                    Welcome
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigationClick("/charts")}
                >
                  Charts
                </SidebarMenuButton>
              </SidebarMenuItem>

              {connectionStatus === "connected" && (
                <Collapsible className="group/collapsible">
                  <CollapsibleTrigger>
                    <SidebarMenuButton>
                      <span>Tools</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {Object.entries(cardPresets).map(([key, preset]) => (
                        <SidebarMenuSubItem key={key}>
                          <SidebarMenuSubButton
                            onClick={() => handleNavigationClick(preset.url)}
                          >
                            {preset.title}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="w-full flex-row items-center justify-center space-x-2 pb-12">
        <DarkMode />
        <ConnectWalletButton className="!w-fit" />
      </SidebarFooter>
    </Sidebar>
  );
}
