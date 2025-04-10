"use client";

import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import { client, wallets } from "pec/lib/wallet/client";
import type { StyleableComponent } from "pec/types/components";
import { defineChain, mainnet } from "thirdweb/chains";
import { ConnectButton } from "thirdweb/react";

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
          "!rounded-full !bg-primary !hover:bg-indigo-400 !text-white !text-xs !py-2 !h-10 !font-570 !leading[13px] !text-[13px] !shadow-[0px_0px_20px_0px_white] !px-4",
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
