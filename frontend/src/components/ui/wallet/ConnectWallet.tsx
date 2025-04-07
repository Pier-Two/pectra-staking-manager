"use client";

import { ConnectButton } from "thirdweb/react";
import { client, wallets } from "pec/lib/wallet/client";
import type { StyleableComponent } from "pec/types/components";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";

export const ConnectWalletButton = ({ className }: StyleableComponent) => {
  const router = useRouter();

  return (
    <ConnectButton
      connectButton={{
        label: "Connect Wallet",
        className: clsx(
          "!w-full !rounded-full !bg-indigo-500 !hover:bg-indigo-400 !text-white !text-xs !py-2 !h-auto",
          className,
        ),
      }}
      autoConnect
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
