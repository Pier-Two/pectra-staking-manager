"use client";

import { clsx } from "clsx";

import { useRouter } from "next/navigation";
import { SUPPORTED_CHAINS } from "pec/constants/chain";
import { useTheme } from "pec/hooks/useTheme";
import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "pec/lib/wallet/auth";
import { client, wallets } from "pec/lib/wallet/client";
import { api } from "pec/trpc/react";
import type { StyleableComponent } from "pec/types/components";
import { useEffect, useState } from "react";
import { ConnectButton } from "thirdweb/react";
export const ConnectWalletButton = ({ className }: StyleableComponent) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const utils = api.useUtils();
  const { darkMode } = useTheme();

  // This is to prevent the component from rendering on the server can causing hydration errors from the dynamic theme styling
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <ConnectButton
      connectButton={{
        label: "Connect Wallet",
        className: clsx(
          "!rounded-full !bg-primary !hover:bg-indigo-400 !text-white !text-xs !shadow-[0px_0px_20px_0px_white] dark:!shadow-[0px_0px_20px_0px_black] !px-4 !py-2 !h-10 !font-570 !leading[13px] !text-[13px] !px-4 dark:!bg-black w-[420px] max-w-[90%]",
          className,
        ),
        style: {
          border: `1px solid ${darkMode ? "#374151" : "transparent"}`,
        },
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