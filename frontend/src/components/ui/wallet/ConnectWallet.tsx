"use client";

import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "pec/hooks/useTheme";
import { useWalletAddress } from "pec/hooks/useWallet";
import { client, wallets } from "pec/lib/wallet/client";
import type { StyleableComponent } from "pec/types/components";
import { useEffect, useState } from "react";
import { defineChain, mainnet } from "thirdweb/chains";
import {
  ConnectButton,
  useEnsAvatar,
  useEnsName,
  useWalletDetailsModal,
} from "thirdweb/react";
import { Button } from "../button";

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
  const address = useWalletAddress();
  const detailsModal = useWalletDetailsModal();
  const { data: ensName } = useEnsName({ client, address });
  const { data: ensAvatar } = useEnsAvatar({ client, ensName });
  const { darkMode = false } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Because the theme is being used dynamically, we need to wait to render the component. to avoid hydration errors.
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return !address ? (
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
  ) : (
    <Button
      variant="ghost"
      className="h-10 rounded-full border border-primary/30 hover:bg-primary/10 dark:border-gray-700 dark:bg-black dark:hover:bg-gray-900 dark:text-white"
      onClick={async () => {
        detailsModal.open({ client, theme: darkMode ? "dark" : "light" });
      }}
    >
      {!!ensAvatar ? (
        // eslint-disable-next-line @next/next/no-img-element -- Image comes from non-whitelisted url. Use img incase it can change
        <img src={ensAvatar} alt="Avatar" className="h-4 w-4 rounded-full" />
      ) : (
        // TODO: Could improve no image avatar
        <div className="h-4 w-4 rounded-full bg-primary" />
      )}
      {ensName ?? `${address.slice(0, 6)}...${address.slice(-4)}`}
      <ChevronDown size={16} />
    </Button>
  );
};