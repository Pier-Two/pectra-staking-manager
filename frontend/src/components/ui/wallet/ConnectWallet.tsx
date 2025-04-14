"use client";

import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import { client, wallets } from "pec/lib/wallet/client";
import type { StyleableComponent } from "pec/types/components";
import { ConnectButton } from "thirdweb/react";
import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "pec/lib/wallet/auth";
import { SUPPORTED_CHAINS } from "pec/constants/chain";
import { api } from "pec/trpc/react";

export const ConnectWalletButton = ({ className }: StyleableComponent) => {
  const router = useRouter();
  const utils = api.useUtils();

  return (
    <ConnectButton
      connectButton={{
        label: "Connect Wallet",
        className: clsx(
          "!rounded-full !bg-primary !hover:bg-indigo-400 !text-white !text-xs !py-2 !h-10 !font-570 !leading[13px] !text-[13px] !shadow-[0px_0px_20px_0px_white] !px-4",
          className,
        ),
      }}
      autoConnect
      chains={SUPPORTED_CHAINS}
      client={client}
      wallets={wallets}
      connectModal={{
        size: "wide",
        title: "Login/Sign up",
      }}
      onDisconnect={() => {
        router.push("/welcome");
      }}
      auth={{
        isLoggedIn: async () => {
          try {
            const result = await isLoggedIn();
            return result.success;
          } catch (error) {
            console.error("Error calling isLoggedIn:", error);
            return false;
          }
        },
        doLogin: async (params) => {
          await login(params);
          // Invalidate the user query after login

          await utils.users.getUser.invalidate();
        },
        getLoginPayload: async ({ address }) => generatePayload({ address }),
        doLogout: async () => {
          await utils.users.getUser.invalidate();

          await logout();

          router.push("/welcome");
        },
      }}
    />
  );
};

// <Button
//   variant="ghost"
//   className="h-10 rounded-full border border-primary/30 hover:bg-primary/10"
//   onClick={async () => {
//     detailsModal.open({ client, theme: "light" });
//   }}
// >
//   {!!ensAvatar ? (
//     // eslint-disable-next-line @next/next/no-img-element -- Image comes from non-whitelisted url. Use img incase it can change
//     <img src={ensAvatar} alt="Avatar" className="h-4 w-4 rounded-full" />
//   ) : (
//     // TODO: Could improve no image avatar
//     <div className="h-4 w-4 rounded-full bg-primary" />
//   )}
//   {ensName ?? `${address.slice(0, 6)}...${address.slice(-4)}`}
//   <ChevronDown size={16} />
// </Button>
