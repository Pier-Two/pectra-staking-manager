"use client";

import { ConnectButton } from "thirdweb/react";
import { client, wallets } from "pec/lib/wallet/client";
import type { StyleableComponent } from "pec/types/components";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import { defineChain, mainnet } from "thirdweb/chains";

const hoodiChain = defineChain({
  id: 560048,
  rpc: "https://0xrpc.io/hoodi",
  blockExplorers: [
    {
      name: "Hoodiscan",
      url: "https://hoodi.etherscan.io/",
    },
  ],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
});

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
      chains={[hoodiChain, mainnet]}
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
