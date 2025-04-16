"use client";

import { clsx } from "clsx";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { SUPPORTED_CHAINS } from "pec/constants/chain";
import { useTheme } from "pec/hooks/useTheme";
import { useWalletAddress } from "pec/hooks/useWallet";
import { client, wallets } from "pec/lib/wallet/client";
import type { StyleableComponent } from "pec/types/components";
import { useEffect, useState } from "react";
import {
  ConnectButton,
  useEnsAvatar,
  useEnsName,
  useWalletDetailsModal,
} from "thirdweb/react";
import { Button } from "../button";
export const ConnectWalletButton = ({ className }: StyleableComponent) => {
  const router = useRouter();
  const { darkMode } = useTheme();
  const address = useWalletAddress();
  const detailsModal = useWalletDetailsModal();
  const [isMounted, setIsMounted] = useState(false);
  const { data: ensName } = useEnsName({ client, address });
  const { data: ensAvatar } = useEnsAvatar({ client, ensName });

  // This is to prevent the component from rendering on the server causing hydration errors from the dynamic theme styling
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
      theme={darkMode ? "dark" : "light"}
      // Details Button ---- Using a custom Component because matching the mocked styling with className Prop is not possible
      detailsButton={{
        render: () => {
          return (
            <Button
              variant="ghost"
              className="h-10 rounded-full border border-primary/30 hover:bg-primary/10 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900"
              onClick={() => {
                detailsModal.open({
                  client,
                  theme: darkMode ? "dark" : "light",
                });
              }}
            >
              {ensAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element -- Image comes from non-whitelisted url. Use img incase it can change
                <img
                  src={ensAvatar}
                  alt="Avatar"
                  className="h-4 w-4 rounded-full"
                />
              ) : (
                <div className="h-4 w-4 rounded-full bg-primary" />
              )}
              {ensName ?? `${address?.slice(0, 6)}...${address?.slice(-4)}`}
              <ChevronDown size={16} />
            </Button>
          );
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
    />
  );
};

