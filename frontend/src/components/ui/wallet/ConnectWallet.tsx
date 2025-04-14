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
