import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "pec/components/ui/sidebar";
import Image from "next/image";
import { ConnectWalletButton } from "./ui/wallet/ConnectWallet";

export function AppSidebar() {
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
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <ConnectWalletButton />
      </SidebarFooter>
    </Sidebar>
  );
}
